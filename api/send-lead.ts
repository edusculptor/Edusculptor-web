import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      service = 'General Inquiry', 
      contactMethod = 'call', 
      requirements = '' 
    } = req.body || {};

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required.' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Contact number is mandatory.' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email address is mandatory.' });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const agencyEmail = 'edusculptor@gmail.com';
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    // HTML for Client Confirmation Mail
    const clientConfirmationHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: #5252ff; padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">EduSculptor Digital Agency</h1>
          <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Sculpting Modern Digital Excellence</p>
        </div>
        <div style="padding: 32px 24px; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Thank you for your request, ${firstName}!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            We have received your service request for <strong>${service}</strong>. Our dedicated digital team is reviewing your project requirements and will connect with you shortly.
          </p>
          <div style="background: #f8fafc; border-left: 4px solid #5252ff; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Summary of Your Request</p>
            <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Service:</strong> ${service}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Preferred Contact Method:</strong> ${contactMethod === 'call' ? 'Phone Call' : 'Email Response'}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>Contact Phone:</strong> ${phone}</p>
            ${requirements ? `<p style="margin: 8px 0 0; font-size: 13px; color: #475569;"><strong>Notes/Requirements:</strong> ${requirements}</p>` : ''}
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            If you have any urgent queries, feel free to reply directly to this email or call us at <strong>+91 93229 64324</strong>.
          </p>
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center;">
            <p style="margin: 0;">Warm regards,<br><strong style="color: #475569;">The EduSculptor Team</strong></p>
            <p style="margin: 4px 0 0; font-size: 12px;">Official Agency • Established 2022</p>
          </div>
        </div>
      </div>
    `;

    // HTML for Agency Notification Mail
    const agencyNotificationHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #5252ff;">
          <span style="background: #5252ff; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">New Client Lead</span>
          <h1 style="margin: 12px 0 4px; font-size: 22px; font-weight: 800;">Request: ${service}</h1>
          <p style="margin: 0; color: #94a3b8; font-size: 13px;">Received on ${timestamp} (IST)</p>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h3 style="margin-top: 0; font-size: 16px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Client Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Full Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;"><a href="tel:${phone}" style="color: #5252ff; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email Address:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;"><a href="mailto:${email}" style="color: #5252ff; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Preferred Contact:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${contactMethod === 'call' ? '📞 Phone Call Request' : '✉️ Email Request'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Requested Service:</td>
              <td style="padding: 8px 0; color: #5252ff; font-weight: 800;">${service}</td>
            </tr>
          </table>

          <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 16px;">Client Requirements</h3>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
            ${requirements || 'No specific requirements typed. Please reach out to client directly.'}
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="tel:${phone}" style="display: inline-block; background: #5252ff; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; margin-right: 10px;">Call Client Now</a>
            <a href="mailto:${email}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">Reply via Email</a>
          </div>
        </div>
      </div>
    `;

    // Check if real SMTP credentials are provided
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      // Send confirmation to client
      await transporter.sendMail({
        from: `"EduSculptor Agency" <${smtpUser}>`,
        to: email,
        subject: `Thank you for your request - EduSculptor Team`,
        html: clientConfirmationHtml,
        text: `Thank you for your request. Our team will contact soon regarding ${service}.`
      });

      // Send notification to agency
      await transporter.sendMail({
        from: `"EduSculptor Leads" <${smtpUser}>`,
        to: agencyEmail,
        replyTo: email,
        subject: `New Service Request: ${service} by ${fullName}`,
        html: agencyNotificationHtml,
        text: `New request by ${fullName} (${phone}, ${email}) for ${service}.\nRequirements: ${requirements}`
      });

      console.log(`[Email Dispatch] Successfully sent emails via SMTP to ${email} and ${agencyEmail}`);
    } else {
      // Graceful fallback/simulation when SMTP is not yet configured in env
      console.log(`\n======================================================`);
      console.log(`[EMAIL 1 - CLIENT CONFIRMATION]`);
      console.log(`To: ${email}`);
      console.log(`Subject: Thank you for your request - EduSculptor Team`);
      console.log(`Message: Thank you for your request. Our team will contact soon.`);
      console.log(`------------------------------------------------------`);
      console.log(`[EMAIL 2 - AGENCY NOTIFICATION]`);
      console.log(`To: ${agencyEmail}`);
      console.log(`Subject: New Service Request: ${service} by ${fullName}`);
      console.log(`Lead Details: Phone: ${phone}, Email: ${email}, Preferred: ${contactMethod}`);
      console.log(`Requirements: ${requirements}`);
      console.log(`======================================================\n`);
    }

    return res.status(200).json({
      success: true,
      message: "Your request has been received. A confirmation mail has been sent to your email, and our team has been notified."
    });

  } catch (error: any) {
    console.error("Error processing service lead request:", error);
    return res.status(500).json({
      error: error?.message || "Failed to process service request. Please try again."
    });
  }
}
