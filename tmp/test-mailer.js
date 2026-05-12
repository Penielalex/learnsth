const nodemailer = require('nodemailer');
require('dotenv').config();

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const secure = process.env.SMTP_SECURE === 'true';

async function main() {
    console.log('Testing Nodemailer connection...');
    console.log(`Settings: ${host}:${port} (Secure: ${secure})`);
    console.log(`User: ${user}`);

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    });

    try {
        // Verify connection configuration
        await transporter.verify();
        console.log('Connection successful! SMTP server is ready to take messages.');

        // Send test email
        const info = await transporter.sendMail({
            from: `"LearnSth Test" <${user}>`,
            to: user, // Send to self
            subject: 'Nodemailer Connection Test',
            text: 'If you see this, your SMTP settings are working!',
            html: '<b>If you see this, your SMTP settings are working!</b>',
        });
        console.log('Test email sent: %s', info.messageId);
    } catch (error) {
        console.error('Connection/Send failed:', error);
    }
}

main();
