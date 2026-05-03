import nodemailer from 'nodemailer';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/index.js';

// Create reusable transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword,
  },
});

/**
 * @desc    Send contact form email
 * @route   POST /api/contact
 * @access  Public
 */
export const sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const mailOptions = {
    from: `"Hermes Contact Form" <${config.gmailUser}>`,
    to: config.gmailUser,
    replyTo: email,
    subject: `New Contact Inquiry from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #0f0f15; color: #e2e8f0; padding: 32px; border-radius: 12px; border: 1px solid #2d2d3d;">
        <h2 style="color: #6366f1; margin-top: 0;">New Contact Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; width: 100px; vertical-align: top;">Name</td>
            <td style="padding: 10px 0; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; vertical-align: top;">Email</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <hr style="border-color: #2d2d3d; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px; margin: 0;">Sent via Hermes AI Contact Form</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ success: true, message: 'Email sent successfully.' });
});
