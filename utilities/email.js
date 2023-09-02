const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstname = user.user_name.split(' ')[0];
        this.url = url;
        this.from = `AbdulRahman Sharief <AbdulRahmanSharief1@gmail.com>`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            secure: false,
            port: 587,
            auth: {
                user: "269c99c6585474",
                pass: "92e8fd47109009"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async send(res, template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstname,
                url: this.url,
                subject
            }
        );

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,

            html,
            text: htmlToText(html)
        };

        return await this.newTransport().sendMail(mailOptions).then((info) => {
            console.log(`Message sent: ${info.response}`);
        });
    }



    async sendPasswordReset(res) {
        return await this.send(res,
            'passwordReset',
            'Your Password Reset Token is only valid for 10 mins'
        );
    }
};