const sandGrid = require('@sendgrid/mail');
require('dotenv').config();

class CreateSenderSandGrid {
  async send(msg) {
    sandGrid.setApiKey(process.env.SENDGRID_API_KEY);
    return await sandGrid.send({ ...msg, from: 'anji.mekh@gmail.com' });
  }
};


module.exports = { CreateSenderSandGrid };
