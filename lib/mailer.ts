import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const secure = process.env.SMTP_SECURE === 'true';
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
        user,
        pass,
    },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
        const info = await transporter.sendMail({
            from: `"LearnSth" <${user}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
