const nodemailer = require('nodemailer');

// IMPORTANT: Replace with your Gmail credentials
// Use your Gmail address and an App Password (NOT your regular Gmail password)
// How to get App Password: https://support.google.com/accounts/answer/185833
const GMAIL_USER = 'noreplyeventhub12@gmail.com'; // Your Gmail address
const GMAIL_APP_PASSWORD = '';

// Create transporter using standard SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Send event reminder email to a user
 */
const sendEventReminder = async (userEmail, userName, event) => {
    const mailOptions = {
        from: `EventHub <${GMAIL_USER}>`,
        to: userEmail,
        subject: `Reminder: ${event.title} is coming up!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">Event Reminder</h2>
                <p>Hi ${userName},</p>
                <p>This is a friendly reminder about the upcoming event you RSVP'd to:</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1f2937;">${event.title}</h3>
                    <p style="margin: 10px 0;"><strong>Date:</strong> ${event.date}</p>
                    <p style="margin: 10px 0;"><strong>Time:</strong> ${event.time}</p>
                    <p style="margin: 10px 0;"><strong>Location:</strong> ${event.location}</p>
                    <p style="margin: 10px 0;"><strong>Category:</strong> ${event.category}</p>
                </div>
                
                <p>${event.description}</p>
                
                <p style="margin-top: 30px;">We look forward to seeing you there!</p>
                <p style="color: #6b7280; font-size: 14px;">
                    If you can no longer attend, please update your RSVP on our platform.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${userEmail}:`, info.messageId);
        return { success: true };
    } catch (error) {
        console.error(`Error sending email to ${userEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendEventReminder,
};
