async function testAPI() {
    const params = new URLSearchParams({
        apiToken: '22279|1Khrs6pJRdeatneNI2PVvZqjL8FjZwyqcyMUroyzb93231a3', // the one from their config
        phone_number_id: '938657545999837',
        phone_number: '919198982231',
        limit: '10',
        offset: '1'
    });

    try {
        const res = await fetch('https://app.whatsmarketing.in/api/v1/whatsapp/get/conversation', {
            method: 'POST',
            body: params
        });
        const data = await res.json();
        
        let messages = data.message;
        if (typeof messages === 'string') {
            messages = JSON.parse(messages);
        }
        
        console.log("Total messages:", messages ? (Array.isArray(messages) ? messages.length : Object.keys(messages).length) : 0);
        if (messages) {
            const arr = Array.isArray(messages) ? messages : Object.values(messages);
            console.log("First message sample:", JSON.stringify(arr[0], null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

testAPI();
