const sendGrid = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

require('dotenv').config();

class CreateSenderSendGrid {
  async send(msg) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    return await sendGrid.send({ ...msg, from: 'anji.mekh@gmail.com' });
  }
};

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD,
      },
    }
    const transporter = nodemailer.createTransport(config)
    return await transporter.sendMail({ ...msg, from: process.env.EMAIL })
  }
};


module.exports = { CreateSenderSendGrid, CreateSenderNodemailer }
