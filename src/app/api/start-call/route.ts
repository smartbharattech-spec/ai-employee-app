import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Path to the python script
    const scriptPath = path.join(process.cwd(), 'voice_agent', 'agent.py');
    
    console.log(`Starting AI Voice Agent at: ${scriptPath}`);

    // Spawn the python process
    // Note: This runs asynchronously in the background. 
    // In a production environment, you should manage these processes (e.g., kill them when done).
    const pythonProcess = spawn('python', [scriptPath], {
      detached: true,
      stdio: 'ignore'
    });

    pythonProcess.unref(); // Allow the parent process to exit independently

    return NextResponse.json({ 
      success: true, 
      message: 'AI Voice Agent started successfully! Speak into the microphone.' 
    });

  } catch (error: any) {
    console.error('Error starting agent:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to start AI Agent: ' + (error.message || String(error)) 
    }, { status: 500 });
  }
}
