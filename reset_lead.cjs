const tokenPayload = { email: "admin@myvastutool.com", role: "admin" };
const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
const cookie = `auth_token=${token}`;

const url = 'https://ai-employee-app-1.onrender.com/api/pipeline';
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': cookie
  },
  body: JSON.stringify({
    action: 'reset_lead',
    phone_number: '918707526283'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
