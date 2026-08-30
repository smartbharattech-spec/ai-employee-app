import asyncio
import websockets
import json
import base64
import pyaudio
import threading
import queue
from config import get_api_key

# Audio Configuration
FORMAT = pyaudio.paInt16
CHANNELS = 1
INPUT_RATE = 16000 # Gemini expects 16kHz for mic input
OUTPUT_RATE = 24000 # Gemini returns 24kHz for audio output
CHUNK_SIZE = 512

class LiveVoiceAgent:
    def __init__(self):
        self.api_key = get_api_key()
        self.url = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={self.api_key}"
        # Using Gemini 2.5 Flash Native Audio
        self.model = "models/gemini-2.5-flash-native-audio-latest"
        
        self.pyaudio_instance = pyaudio.PyAudio()
        
        self.speaker_queue = queue.Queue()
        self.mic_queue = asyncio.Queue()
        self.is_running = True
        self.ai_is_speaking = False  # Track if AI is currently playing audio

    def _mic_thread_worker(self, loop):
        """Runs in a background thread to capture microphone audio"""
        try:
            stream = self.pyaudio_instance.open(
                format=FORMAT,
                channels=CHANNELS,
                rate=INPUT_RATE,
                input=True,
                frames_per_buffer=CHUNK_SIZE
            )
            print("[System] Microphone listening...")
            while self.is_running:
                data = stream.read(CHUNK_SIZE, exception_on_overflow=False)
                # Software Ducking: Only send to Gemini if AI is NOT speaking
                if not self.ai_is_speaking:
                    loop.call_soon_threadsafe(self.mic_queue.put_nowait, data)
        except Exception as e:
            print(f"[Error] Mic error: {e}")
        finally:
            if 'stream' in locals() and stream.is_active():
                stream.stop_stream()
                stream.close()

    def _speaker_thread_worker(self):
        """Runs in a background thread to play audio from the queue"""
        try:
            stream = self.pyaudio_instance.open(
                format=FORMAT,
                channels=CHANNELS,
                rate=OUTPUT_RATE,
                output=True,
                frames_per_buffer=CHUNK_SIZE
            )
            print("[System] Speaker ready...")
            while self.is_running:
                # Block until audio is available
                data = self.speaker_queue.get()
                if data is None: # Sentinel value to stop
                    break
                
                self.ai_is_speaking = True
                stream.write(data)
                
                # If queue is empty after writing, AI has paused or stopped
                if self.speaker_queue.empty():
                    self.ai_is_speaking = False
                    
        except Exception as e:
            print(f"[Error] Speaker error: {e}")
            self.ai_is_speaking = False
        finally:
            if 'stream' in locals() and stream.is_active():
                stream.stop_stream()
                stream.close()

    def clear_speaker_queue(self):
        """Clears the speaker queue for barge-in (interruption)"""
        with self.speaker_queue.mutex:
            self.speaker_queue.queue.clear()

    async def _ws_send_task(self, ws):
        """Task to continuously send microphone data to Gemini"""
        while self.is_running:
            # Wait for audio data from the mic
            pcm_data = await self.mic_queue.get()
            
            # Encode to base64
            b64_data = base64.b64encode(pcm_data).decode("utf-8")
            
            msg = {
                "realtimeInput": {
                    "mediaChunks": [{
                        "mimeType": f"audio/pcm;rate={INPUT_RATE}",
                        "data": b64_data
                    }]
                }
            }
            try:
                await ws.send(json.dumps(msg))
            except Exception as e:
                print(f"[Error] WebSocket Send failed: {e}")
                break

    async def _ws_receive_task(self, ws):
        """Task to continuously receive data from Gemini"""
        while self.is_running:
            try:
                response_str = await ws.recv()
                response = json.loads(response_str)
                
                if "serverContent" in response:
                    server_content = response["serverContent"]
                    
                    if "interrupted" in server_content and server_content["interrupted"]:
                        print("[System] Barge-in detected! Stopping current AI speech...")
                        self.clear_speaker_queue()
                        
                    if "modelTurn" in server_content:
                        parts = server_content["modelTurn"].get("parts", [])
                        for part in parts:
                            if "inlineData" in part:
                                base64_audio = part["inlineData"]["data"]
                                audio_bytes = base64.b64decode(base64_audio)
                                self.speaker_queue.put(audio_bytes)
                                
                    if server_content.get("turnComplete"):
                        pass # The AI has finished its current turn
                        
            except websockets.exceptions.ConnectionClosed:
                print("[System] Connection closed by server.")
                break
            except Exception as e:
                print(f"[Error] Receive error: {e}")
                break

    async def run(self):
        print("[System] Connecting to Gemini Live API...")
        async with websockets.connect(self.url) as ws:
            print("[System] Connected!")
            
            # Send Setup Message
            setup_msg = {
                "setup": {
                    "model": self.model,
                    "systemInstruction": {
                        "parts": [{"text": "You are Kriti, an AI Sales Executive for 'Vastu With Nikhil'. You must ONLY speak in Hinglish (Hindi mixed with English). You are calling clients to pitch Vastu consultation services, answer basic Vastu questions, and guide them to book a consultation link. Be persuasive, confident, and very polite. Do not use complex words."}]
                    },
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {
                                    "voiceName": "Leda"
                                }
                            }
                        }
                    }
                }
            }
            await ws.send(json.dumps(setup_msg))
            setup_response = await ws.recv()
            
            # Connection Pre-warming: Send a tiny silent chunk to fully open the audio pipeline
            silent_chunk = b'\x00' * (CHUNK_SIZE * 2) # 1 chunk of silence
            b64_silent = base64.b64encode(silent_chunk).decode("utf-8")
            warmup_msg = {"realtimeInput": {"mediaChunks": [{"mimeType": f"audio/pcm;rate={INPUT_RATE}", "data": b64_silent}]}}
            await ws.send(json.dumps(warmup_msg))
            
            print("[System] Setup complete. Pipeline pre-warmed. You can start talking now!")

            # Start background threads for Audio I/O
            loop = asyncio.get_running_loop()
            mic_thread = threading.Thread(target=self._mic_thread_worker, args=(loop,), daemon=True)
            speaker_thread = threading.Thread(target=self._speaker_thread_worker, daemon=True)
            
            mic_thread.start()
            speaker_thread.start()

            # Start Async WebSockets Tasks
            send_task = asyncio.create_task(self._ws_send_task(ws))
            receive_task = asyncio.create_task(self._ws_receive_task(ws))
            
            # Wait for both tasks
            await asyncio.gather(send_task, receive_task)

    def stop(self):
        self.is_running = False
        self.speaker_queue.put(None) # Unblock speaker thread
        self.pyaudio_instance.terminate()

if __name__ == "__main__":
    agent = LiveVoiceAgent()
    try:
        asyncio.run(agent.run())
    except KeyboardInterrupt:
        print("\n[System] Stopping Agent...")
        agent.stop()
