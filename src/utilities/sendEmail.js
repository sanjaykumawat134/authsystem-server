const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const sendEmail = async (email, subject, text) => {
   
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN})
    console.log("dd",oAuth2Client)
    try {
        const accessToken = await oAuth2Client.getAccessToken();
           console.log("token",accessToken)
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            service: process.env.SERVICE,
            // port: 587,
            // host: 'smtp.gmail.com',
            // port: 465,
            // secure: true,
            auth: {
               type:'OAuth2',
               user:'sanjaykumawat134dev@gmail.com',
               clientId:process.env.CLIENT_ID,
               clientSecret:process.env.CLIENT_SECRET,
               refreshToken:process.env.REFRESH_TOKEN,
               accessToken:accessToken
            },
        });
       const resp = await transporter.sendMail({
            from: 'sanjaykumawat134dev@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully",resp);
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;