import nodemailer, { type Transporter } from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
}

function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"i-VANTAGE Hub" <contact@i-vantage.in>`;

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass, from };
}

let transporter: Transporter | null = null;

function getTransporter() {
  const config = getEmailConfig();
  if (!config) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return { transporter, from: config.from };
}

export interface LeadEmailPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientMessage?: string;
  spaceTitle: string;
  spaceLocation?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorBusinessName?: string;
  leadId: string;
}

export async function sendLeadNotifications(payload: LeadEmailPayload) {
  const results = {
    clientSent: false,
    vendorSent: false,
    adminSent: false,
  };

  const mailService = getTransporter();
  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL || "contact@i-vantage.in";

  // 1. Client Confirmation Email
  if (payload.clientEmail) {
    const clientSubject = `Tour Enquiry Confirmed: ${payload.spaceTitle} — i-VANTAGE Hub`;
    const clientHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0A1F66 0%, #1E5BFF 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">i-VANTAGE</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #cbd5e1; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Commercial Coworking Marketplace</p>
        </div>
        <div style="padding: 32px 24px; color: #1e293b;">
          <div style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px;">
            ✓ Request Received
          </div>
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a;">Hello ${escapeHtml(payload.clientName)},</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
            Thank you for scheduling an enquiry for <strong>${escapeHtml(payload.spaceTitle)}</strong>. Our dedicated workspace manager and advisory team have received your request.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Enquiry Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 35%;">Workspace:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.spaceTitle)}</td>
              </tr>
              ${payload.spaceLocation ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Location:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.spaceLocation)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Contact:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.clientPhone)}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #1E5BFF; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
              <strong>What's Next:</strong> A center representative will connect with you shortly to coordinate tour availability, answer custom seating queries, and ensure exclusive client privileges.
            </p>
          </div>

          <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
            i-VANTAGE Business Hub • Support: +91 99999 88888 • contact@i-vantage.in
          </p>
        </div>
      </div>
    `;

    if (mailService) {
      try {
        await mailService.transporter.sendMail({
          from: mailService.from,
          to: payload.clientEmail,
          subject: clientSubject,
          html: clientHtml,
        });
        results.clientSent = true;
      } catch (err: any) {
        console.error("Failed to send client confirmation email:", err.message);
      }
    } else {
      console.log(`📨 [MOCK EMAIL to Client: ${payload.clientEmail}] Subject: "${clientSubject}"`);
      results.clientSent = true;
    }
  }

  // 2. Vendor Partner Alert Email
  const vendorTargetEmail = payload.vendorEmail;
  if (vendorTargetEmail) {
    const vendorSubject = `⚡ New Space Tour Enquiry: ${payload.spaceTitle} — i-VANTAGE`;
    const vendorHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: #0A1F66; padding: 24px; text-align: left; color: #ffffff; border-bottom: 3px solid #F4A900;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800;">i-VANTAGE Partner Portal</h1>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">New Commercial Lead Alert</p>
        </div>
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #0f172a;">New Enquiry for ${escapeHtml(payload.spaceTitle)}</h2>
          <p style="margin: 0 0 20px; font-size: 14px; color: #475569;">
            A verified prospective client has submitted an enquiry for your space listing on i-VANTAGE Hub.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 30%;">Client Name:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${escapeHtml(payload.clientName)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Phone:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #1E5BFF;">
                  <a href="tel:${escapeHtml(payload.clientPhone)}" style="color: #1E5BFF; text-decoration: none;">${escapeHtml(payload.clientPhone)}</a>
                </td>
              </tr>
              ${payload.clientEmail ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Email:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">
                  <a href="mailto:${escapeHtml(payload.clientEmail)}" style="color: #0f172a; text-decoration: none;">${escapeHtml(payload.clientEmail)}</a>
                </td>
              </tr>` : ""}
              ${payload.clientMessage ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Requirement:</td>
                <td style="padding: 6px 0; color: #334155; font-style: italic;">"${escapeHtml(payload.clientMessage)}"</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://i-vantage.in/vendor/leads" style="display: inline-block; background: #1E5BFF; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(30, 91, 255, 0.25);">
              Open Partner Portal &rarr;
            </a>
          </div>

          <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
            This enquiry is exclusively routed to your Partner account (${escapeHtml(payload.vendorBusinessName || payload.vendorName || "Partner")}).
          </p>
        </div>
      </div>
    `;

    if (mailService) {
      try {
        await mailService.transporter.sendMail({
          from: mailService.from,
          to: vendorTargetEmail,
          subject: vendorSubject,
          html: vendorHtml,
        });
        results.vendorSent = true;
      } catch (err: any) {
        console.error("Failed to send vendor alert email:", err.message);
      }
    } else {
      console.log(`📨 [MOCK EMAIL to Vendor: ${vendorTargetEmail}] Subject: "${vendorSubject}"`);
      results.vendorSent = true;
    }
  }

  // 3. SuperAdmin Lead Notification
  if (adminEmail) {
    const adminSubject = `[Marketplace Tour Lead] ${payload.spaceTitle} (${payload.clientName})`;
    const adminHtml = `
      <div style="font-family: sans-serif; padding: 16px;">
        <h3>New Marketplace Lead Received</h3>
        <p><strong>Property:</strong> ${escapeHtml(payload.spaceTitle)}</p>
        <p><strong>Vendor Partner:</strong> ${escapeHtml(payload.vendorBusinessName || payload.vendorName || "N/A")} (${escapeHtml(payload.vendorEmail || "N/A")})</p>
        <p><strong>Client:</strong> ${escapeHtml(payload.clientName)} (${escapeHtml(payload.clientPhone)})</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.clientEmail || "N/A")}</p>
        <p><strong>Message:</strong> ${escapeHtml(payload.clientMessage || "N/A")}</p>
        <p><a href="https://i-vantage.in/admin/leads">View in Admin Panel</a></p>
      </div>
    `;

    if (mailService) {
      try {
        await mailService.transporter.sendMail({
          from: mailService.from,
          to: adminEmail,
          subject: adminSubject,
          html: adminHtml,
        });
        results.adminSent = true;
      } catch (err: any) {
        console.error("Failed to send admin lead alert email:", err.message);
      }
    } else {
      console.log(`📨 [MOCK EMAIL to Admin: ${adminEmail}] Subject: "${adminSubject}"`);
      results.adminSent = true;
    }
  }

  return results;
}

function escapeHtml(text?: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
