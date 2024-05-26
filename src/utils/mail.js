const { MailtrapClient } = require("mailtrap");

const contactUs =  async (options) => {

const client = new MailtrapClient({ endpoint: process.env.MAILTRAP_ENDPOINT, token: process.env.MAILTRAP_TOKEN });

const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Mailtrap Test",
  };
const recipients = [
  {
    email: "shoping6pp@gmail.com",
  }
];


client
  .send({
    from: sender,
    to: recipients,
    subject: options.sub,
    text: options.msg,
  })
  .then(() => {}, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  });
}

module.exports = contactUs;