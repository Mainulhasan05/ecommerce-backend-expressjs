require('dotenv').config();

const sendSMS =(number, message)=>{

    const apiKey = process.env.SMS_API_KEY;
    const senderId = process.env.SMS_SENDER_ID;
    
    const url = `https://smsp.durjoysoft.com/api/sms?ApiKey=${apiKey}&SenderID=${senderId}&number=${number}&sms=${message}`;

    const response = fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
    
    return response;
    
}

module.exports = sendSMS;