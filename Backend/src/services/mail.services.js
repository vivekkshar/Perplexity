import "dotenv/config"
import nodemailer from "nodemailer"





const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        type:'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN
    }   
})

//verify to connection config 


transporter.verify((error, success) => {
        if(error){
            console.error('Error connecting to email server:', error);
        }
        else{
            console.log('Email server is ready to send messages');
        }

    })



export async function sendEmail({to, subject, html, text}){
    try {
        const mailoption = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html, 
            text
        }

        const details= await  transporter.sendMail(mailoption)
        console.log("email sent " , details)
        
    } catch (error) {
        console.error('Error sending email:', error);
        
    }
}    


export default sendEmail;
export { transporter };
