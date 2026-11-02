import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Official real contact information strictly standardized across the entire platform
export const OFFICIAL_CONTACT = {
  name: "i-VANTAGE Business Hub",
  address: "Unit no. 213-14 2nd Floor, Welldone Tech Park Sector 48, Sohna Road Gurugram, Haryana",
  phone: "+91 99078 00600",
  phoneClean: "+919907800600",
  email: "info@i-vantage.in",
  workingHours: "Monday - Friday: 10:00 AM - 07:00 PM",
  website: "https://i-vantage.in",
};

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getEmailConfig() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"i-VANTAGE Hub" <${OFFICIAL_CONTACT.email}>`;

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass, from };
}

let transporter = null;
let currentTransporterConfig = null;

function getTransporter() {
  const config = getEmailConfig();
  if (!config) return null;

  const configKey = `${config.host}:${config.port}:${config.user}:${config.pass}`;
  if (!transporter || currentTransporterConfig !== configKey) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    currentTransporterConfig = configKey;
  }

  return { transporter, from: config.from };
}

/**
 * Dynamic resolution of all SuperAdmin notification recipients
 * Aggregates LEAD_NOTIFICATION_EMAIL, SMTP_USER, OFFICIAL_CONTACT, and DB super_admin users
 */
export async function getSuperAdminEmails() {
  const recipients = new Set();

  // 1. Configured LEAD_NOTIFICATION_EMAIL (supports comma-separated values)
  if (process.env.LEAD_NOTIFICATION_EMAIL) {
    process.env.LEAD_NOTIFICATION_EMAIL.split(",").forEach((e) => {
      const clean = e.trim().toLowerCase();
      if (clean && clean.includes("@")) recipients.add(clean);
    });
  }

  // 2. Official system mailbox
  if (OFFICIAL_CONTACT.email && OFFICIAL_CONTACT.email.includes("@")) {
    recipients.add(OFFICIAL_CONTACT.email.trim().toLowerCase());
  }

  if (process.env.SMTP_USER && process.env.SMTP_USER.includes("@")) {
    recipients.add(process.env.SMTP_USER.trim().toLowerCase());
  }

  // 3. Dynamic active super_admin users in MongoDB
  try {
    const mongoose = (await import("mongoose")).default;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const auths = await mongoose.connection
        .collection("auths")
        .find({ role: "super_admin" }, { projection: { email: 1 } })
        .toArray();
      auths.forEach((a) => {
        if (a.email && a.email.includes("@")) {
          recipients.add(a.email.trim().toLowerCase());
        }
      });
    }
  } catch (err) {
    // Non-blocking fallback
  }

  return Array.from(recipients);
}

// Inline CID attachment for reliable zero-block rendering across Gmail, Outlook, Apple Mail
function getLogoAttachment() {
  const possiblePaths = [
    path.resolve(__dirname, "../assets/ivantage.png"),
    path.resolve(process.cwd(), "server/src/assets/ivantage.png"),
    path.resolve(process.cwd(), "client/public/images/ivantage.png"),
    path.resolve(__dirname, "../../../client/public/images/ivantage.png"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return [
        {
          filename: "ivantage-logo.png",
          path: p,
          cid: "ivantage-logo",
        },
      ];
    }
  }
  return [];
}

/**
 * Unified Header Component for all i-VANTAGE Transactional Emails
 */
function getEmailHeaderHtml({
  badgeText = "Commercial Coworking Marketplace",
  title = "i-VANTAGE",
} = {}) {
  return `
    <div style="background: linear-gradient(135deg, #0A1F66 0%, #1E5BFF 100%); padding: 30px 24px 26px; text-align: center; color: #ffffff;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px; border-collapse: collapse;">
        <tr>
          <td align="center" style="background: #ffffff; padding: 8px 16px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.18);">
            <img src="cid:ivantage-logo" alt="i-VANTAGE" width="56" height="42" style="height: 42px; width: auto; display: block; margin: 0 auto; object-fit: contain; border: 0;" />
          </td>
        </tr>
      </table>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${escapeHtml(title)}</h1>
      <p style="margin: 6px 0 0; font-size: 11px; color: #dbeafe; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${escapeHtml(badgeText)}</p>
    </div>
  `;
}

/**
 * Unified Footer Component for all i-VANTAGE Transactional Emails with strict official contact details
 */
function getEmailFooterHtml() {
  return `
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 20px; text-align: center; color: #64748b; font-size: 12px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #0A1F66;">
        ${OFFICIAL_CONTACT.name}
      </p>
      <p style="margin: 0 0 10px; color: #475569; font-size: 12px; max-width: 480px; margin-left: auto; margin-right: auto;">
        ${OFFICIAL_CONTACT.address}
      </p>
      <div style="margin: 0 auto 10px; padding: 8px 14px; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; font-size: 12px; color: #334155; display: inline-block;">
        <span>📞 Support: <a href="tel:${OFFICIAL_CONTACT.phoneClean}" style="color: #1E5BFF; text-decoration: none; font-weight: 700;">${OFFICIAL_CONTACT.phone}</a></span>
        <span style="margin: 0 10px; color: #94a3b8;">•</span>
        <span>✉️ Email: <a href="mailto:${OFFICIAL_CONTACT.email}" style="color: #1E5BFF; text-decoration: none; font-weight: 700;">${OFFICIAL_CONTACT.email}</a></span>
      </div>
      <p style="margin: 0 0 4px; font-size: 11px; color: #64748b;">
        🕒 Business Hours: <strong>${OFFICIAL_CONTACT.workingHours}</strong>
      </p>
      <p style="margin: 10px 0 0; font-size: 11px; color: #94a3b8;">
        © 2026 i-VANTAGE Business Hub. All Rights Reserved.
      </p>
    </div>
  `;
}

/**
 * 1. Marketplace Workspace Tour / Seating Enquiry Notifications
 * SuperAdmin broadcast + Client confirmation
 */
export async function sendLeadNotifications(payload) {
  const results = {
    clientSent: false,
    adminSent: false,
  };

  const mailService = getTransporter();
  if (!mailService) {
    console.warn("[Email] Mail service unconfigured for sendLeadNotifications");
    return results;
  }

  const adminEmails = await getSuperAdminEmails();
  const logoAttachments = getLogoAttachment();
  const dynamicSpaceTitle = payload.spaceTitle && payload.spaceTitle.trim() ? payload.spaceTitle.trim() : "Workspace Enquiry";

  // 1. Client Confirmation Email
  if (payload.clientEmail) {
    const clientSubject = `Tour Enquiry Confirmed: ${dynamicSpaceTitle} — i-VANTAGE Hub`;
    const clientHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Commercial Coworking Marketplace" })}
        <div style="padding: 32px 24px; color: #1e293b;">
          <div style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 18px;">
            ✓ Request Received & Logged
          </div>
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a;">Hello ${escapeHtml(payload.clientName)},</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
            Thank you for scheduling an enquiry for <strong>${escapeHtml(dynamicSpaceTitle)}</strong>. Our dedicated workspace manager and advisory team have received your request.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Enquiry Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 34%; font-weight: 500;">Workspace:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66; font-size: 15px;">${escapeHtml(dynamicSpaceTitle)}</td>
              </tr>
              ${
                payload.spaceLocation
                  ? `<tr>
                <td style="padding: 7px 0; color: #64748b; font-weight: 500;">Location:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(payload.spaceLocation)}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-weight: 500;">Contact Phone:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.clientPhone)}</td>
              </tr>
              ${
                payload.clientEmail
                  ? `<tr>
                <td style="padding: 7px 0; color: #64748b; font-weight: 500;">Registered Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.clientEmail)}</td>
              </tr>`
                  : ""
              }
            </table>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #1E5BFF; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
              <strong>What's Next:</strong> A center representative will connect with you shortly on ${escapeHtml(payload.clientPhone)} to coordinate tour availability, answer custom seating queries, and ensure exclusive client privileges.
            </p>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: payload.clientEmail,
        subject: clientSubject,
        html: clientHtml,
        attachments: logoAttachments,
      });
      results.clientSent = true;
      console.log(`[Email] Client tour confirmation sent to ${payload.clientEmail} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send client confirmation email:", err.message);
    }
  }

  // 2. SuperAdmin Broadcast Alert
  if (adminEmails.length > 0) {
    const adminSubject = `[Marketplace Tour Lead] ${dynamicSpaceTitle} — ${payload.clientName}`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "SuperAdmin Desk • Workspace Lead Alert" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Marketplace Lead Submitted</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 30%;">Client Name:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(payload.clientName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">${escapeHtml(payload.clientPhone)}</td>
              </tr>
              ${payload.clientEmail ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.clientEmail)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Workspace:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66;">${escapeHtml(dynamicSpaceTitle)}</td>
              </tr>
              ${payload.spaceLocation ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Location:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(payload.spaceLocation)}</td>
              </tr>` : ""}
              ${payload.vendorBusinessName ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Vendor:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(payload.vendorBusinessName)}</td>
              </tr>` : ""}
              ${payload.clientMessage ? `<tr>
                <td style="padding: 7px 0; color: #64748b; vertical-align: top;">Notes:</td>
                <td style="padding: 7px 0; color: #475569; font-style: italic;">"${escapeHtml(payload.clientMessage)}"</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://i-vantage.in/admin/leads" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Manage in Admin CRM →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: adminEmails,
        subject: adminSubject,
        html: adminHtml,
        attachments: logoAttachments,
      });
      results.adminSent = true;
      console.log(`[Email] SuperAdmin tour lead alert sent to ${adminEmails.join(", ")} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send admin lead email:", err.message);
    }
  }

  return results;
}

/**
 * 2. General Contact / Consultation / List Your Space Enquiry Notifications
 * SuperAdmin broadcast + Client confirmation
 */
export async function sendGeneralEnquiryNotification({
  fullName,
  email,
  mobile,
  serviceName = "Business & Workspace Solutions",
  location = "Gurugram, Haryana",
  message = "",
}) {
  const mailService = getTransporter();
  const adminEmails = await getSuperAdminEmails();
  const logoAttachments = getLogoAttachment();
  const results = { clientSent: false, adminSent: false };

  if (!mailService) {
    console.warn("[Email] Mail service unconfigured for sendGeneralEnquiryNotification");
    return results;
  }

  const safeName = fullName || "Prospect";
  const safePhone = mobile || "N/A";

  // 1. Client Confirmation
  if (email) {
    const subject = `Enquiry Received: ${serviceName} — i-VANTAGE Business Hub`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Business Solutions & Workspace Concierge" })}
        <div style="padding: 32px 24px; color: #1e293b;">
          <div style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 18px;">
            ✓ Enquiry Confirmed
          </div>
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a;">Hello ${escapeHtml(safeName)},</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
            Thank you for contacting <strong>i-VANTAGE Business Hub</strong>. We have successfully logged your enquiry for <strong>${escapeHtml(serviceName)}</strong>.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Your Enquiry Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 34%; font-weight: 500;">Service/Query:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66;">${escapeHtml(serviceName)}</td>
              </tr>
              ${location ? `<tr>
                <td style="padding: 7px 0; color: #64748b; font-weight: 500;">Location:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(location)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-weight: 500;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(safePhone)}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #1E5BFF; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
              Our dedicated enterprise concierge advisory team will review your requirement and reach out shortly to discuss tailored commercial packages and assistance.
            </p>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: email,
        subject,
        html,
        attachments: logoAttachments,
      });
      results.clientSent = true;
      console.log(`[Email] Client general confirmation sent to ${email} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send CRM client email:", err.message);
    }
  }

  // 2. SuperAdmin Broadcast Alert
  if (adminEmails.length > 0) {
    const adminSubject = `[General Enquiry] ${serviceName} — ${safeName}`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "SuperAdmin Desk • Business Enquiry" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Business Enquiry Logged</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 30%;">Client Name:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(safeName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">${escapeHtml(safePhone)}</td>
              </tr>
              ${email ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(email)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Service Requested:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66;">${escapeHtml(serviceName)}</td>
              </tr>
              ${location ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Location:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(location)}</td>
              </tr>` : ""}
              ${message ? `<tr>
                <td style="padding: 7px 0; color: #64748b; vertical-align: top;">Message:</td>
                <td style="padding: 7px 0; color: #475569; font-style: italic;">"${escapeHtml(message)}"</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Timestamp:</td>
                <td style="padding: 7px 0; font-weight: 500; color: #64748b;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://i-vantage.in/admin/leads" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Open in Admin CRM →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: adminEmails,
        subject: adminSubject,
        html: adminHtml,
        attachments: logoAttachments,
      });
      results.adminSent = true;
      console.log(`[Email] SuperAdmin general enquiry alert sent to ${adminEmails.join(", ")} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send CRM admin email:", err.message);
    }
  }

  return results;
}

/**
 * 3. Professional Consultation Enquiry Notifications
 * Notifies SuperAdmin, the Empaneled Professional, and confirms with the Client
 */
export async function sendProfessionalEnquiryNotifications({
  clientName,
  clientPhone,
  clientEmail,
  clientMessage,
  serviceName = "General Consultation",
  consultationMode = "Online",
  preferredDate,
  proName,
  proEmail,
  proSlug,
}) {
  const mailService = getTransporter();
  const adminEmails = await getSuperAdminEmails();
  const logoAttachments = getLogoAttachment();
  const results = { proSent: false, adminSent: false, clientSent: false };

  if (!mailService) {
    console.warn("[Email] Mail service unconfigured for sendProfessionalEnquiryNotifications");
    return results;
  }

  const formattedDate = preferredDate ? new Date(preferredDate).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Flexible / ASAP";

  // 1. Alert to Empaneled Professional
  if (proEmail) {
    const proSubject = `New Consultation Request: ${clientName} (${serviceName}) — i-VANTAGE`;
    const proHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Professional Advisory Portal", title: "i-VANTAGE Professionals" })}
        <div style="padding: 30px 24px; color: #1e293b;">
          <div style="display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 18px;">
            ⚡ New Consultation Booking
          </div>
          <h2 style="margin: 0 0 12px; font-size: 19px; font-weight: 700; color: #0A1F66;">Hello ${escapeHtml(proName)},</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
            You have received a new consultation request on your verified i-VANTAGE advisory profile:
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 22px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 34%;">Client Name:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(clientName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;"><a href="tel:${escapeHtml(clientPhone)}" style="color: #1E5BFF; text-decoration: none;">${escapeHtml(clientPhone)}</a></td>
              </tr>
              ${clientEmail ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;"><a href="mailto:${escapeHtml(clientEmail)}" style="color: #0f172a; text-decoration: none;">${escapeHtml(clientEmail)}</a></td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Service:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66;">${escapeHtml(serviceName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Preferred Mode:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(consultationMode)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Preferred Date:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(formattedDate)}</td>
              </tr>
              ${clientMessage ? `<tr>
                <td style="padding: 7px 0; color: #64748b; vertical-align: top;">Client Query:</td>
                <td style="padding: 7px 0; color: #334155; font-style: italic;">"${escapeHtml(clientMessage)}"</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://i-vantage.in/dashboard/professional/enquiries" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Open Consultation Desk →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: proEmail,
        subject: proSubject,
        html: proHtml,
        attachments: logoAttachments,
      });
      results.proSent = true;
      console.log(`[Email] Consultation alert sent to professional ${proEmail} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send professional consultation email:", err.message);
    }
  }

  // 2. Alert to SuperAdmin Broadcast
  if (adminEmails.length > 0) {
    const adminSubject = `[Professional Lead Alert] ${proName} (${serviceName}) — ${clientName}`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "SuperAdmin Desk • Professional Consultation Alert" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Professional Consultation Logged</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 32%;">Expert / Advisor:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66;">${escapeHtml(proName)} (${escapeHtml(proEmail || "N/A")})</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Client Name:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(clientName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">${escapeHtml(clientPhone)}</td>
              </tr>
              ${clientEmail ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(clientEmail)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Service:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">${escapeHtml(serviceName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Mode / Date:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(consultationMode)} • ${escapeHtml(formattedDate)}</td>
              </tr>
              ${clientMessage ? `<tr>
                <td style="padding: 7px 0; color: #64748b; vertical-align: top;">Query:</td>
                <td style="padding: 7px 0; color: #475569; font-style: italic;">"${escapeHtml(clientMessage)}"</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://i-vantage.in/admin/professionals/enquiries" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              View in Admin Panel →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: adminEmails,
        subject: adminSubject,
        html: adminHtml,
        attachments: logoAttachments,
      });
      results.adminSent = true;
      console.log(`[Email] SuperAdmin pro enquiry alert sent to ${adminEmails.join(", ")} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send admin pro enquiry email:", err.message);
    }
  }

  // 3. Client Confirmation
  if (clientEmail) {
    const clientSubject = `Consultation Request Received: ${proName} (${serviceName}) — i-VANTAGE`;
    const clientHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Verified Professional Network" })}
        <div style="padding: 30px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 12px; font-size: 19px; font-weight: 700; color: #0A1F66;">Hello ${escapeHtml(clientName)},</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
            Your consultation request with <strong>${escapeHtml(proName)}</strong> has been received and forwarded to their advisory desk.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 22px;">
            <p style="margin: 4px 0;"><strong>Advisor:</strong> ${escapeHtml(proName)}</p>
            <p style="margin: 4px 0;"><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
            <p style="margin: 4px 0;"><strong>Mode:</strong> ${escapeHtml(consultationMode)}</p>
          </div>

          <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
            ${escapeHtml(proName)} will connect with you via ${escapeHtml(clientPhone)} within 1 business day.
          </p>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      await mailService.transporter.sendMail({
        from: mailService.from,
        to: clientEmail,
        subject: clientSubject,
        html: clientHtml,
        attachments: logoAttachments,
      });
      results.clientSent = true;
      console.log(`[Email] Client consultation confirmation sent to ${clientEmail} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send client consultation confirmation:", err.message);
    }
  }

  return results;
}

/**
 * 4. Professional Registration Notifications
 * SuperAdmin Alert + Welcome Email to Professional
 */
export async function sendProfessionalRegistrationNotifications({
  name,
  proName,
  email,
  proEmail,
  phone,
  proPhone,
  businessName,
  city = "Gurugram",
}) {
  const mailService = getTransporter();
  const adminEmails = await getSuperAdminEmails();
  const logoAttachments = getLogoAttachment();

  if (!mailService) return;

  const resolvedName = name || proName || "Professional Partner";
  const resolvedEmail = email || proEmail;
  const resolvedPhone = phone || proPhone;

  // 1. SuperAdmin Alert
  if (adminEmails.length > 0) {
    const adminSubject = `[New Professional Partner] ${resolvedName} (${city}) Registered`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "SuperAdmin Desk • Professional Onboarding" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Professional Partner Registered</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 32%;">Name:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(resolvedName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #1E5BFF;">${escapeHtml(resolvedEmail || "")}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(resolvedPhone || "N/A")}</td>
              </tr>
              ${businessName ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Practice Name:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(businessName)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">City / Region:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(city)}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://i-vantage.in/admin/professionals" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Review in Admin Panel →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: adminEmails,
        subject: adminSubject,
        html: adminHtml,
        attachments: logoAttachments,
      });
      console.log(`[Email] SuperAdmin professional registered alert sent to ${adminEmails.join(", ")} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send admin professional registration alert:", err.message);
    }
  }

  // 2. Welcome Email to Professional
  if (resolvedEmail) {
    const proSubject = `Welcome to i-VANTAGE Verified Professional Network, ${resolvedName}`;
    const proHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Professional Partner Network", title: "i-VANTAGE Hub" })}
        <div style="padding: 30px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0A1F66;">Welcome, ${escapeHtml(resolvedName)}!</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
            Your account has been successfully created on the <strong>i-VANTAGE Verified Professional Network</strong>. You can now complete your practice details, publish consultation packages, and start connecting with corporate clients.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b;">Next Steps to Go Live</h3>
            <ul style="margin: 0; padding: 0 0 0 18px; color: #334155; font-size: 13.5px; line-height: 1.8;">
              <li>Complete your profile bio, qualifications, and statutory registrations (Bar Council, ICAI, ICSI, etc.).</li>
              <li>Add your consultation service packages and pricing.</li>
              <li>Submit your profile for compliance verification.</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://i-vantage.in/dashboard/professional/profile" style="display: inline-block; background: #1E5BFF; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Access Professional Dashboard →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: resolvedEmail,
        subject: proSubject,
        html: proHtml,
        attachments: logoAttachments,
      });
      console.log(`[Email] Welcome email sent to professional ${resolvedEmail} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send professional welcome email:", err.message);
    }
  }
}

/**
 * 5. Professional Profile / Revision Submission Notifications
 */
export async function sendProfessionalReviewSubmissionNotifications({
  name,
  proName,
  email,
  proEmail,
  type = "Profile Verification",
}) {
  const mailService = getTransporter();
  const adminEmails = await getSuperAdminEmails();
  const logoAttachments = getLogoAttachment();

  if (!mailService) return;

  const resolvedName = proName || name || "Professional Partner";
  const resolvedEmail = proEmail || email;

  // 1. SuperAdmin Alert
  if (adminEmails.length > 0) {
    const adminSubject = `[Compliance Review] ${resolvedName} Submitted ${type}`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Compliance & Verification Desk" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">Professional Profile Submitted for Review</h2>
          <p style="margin: 0 0 16px; font-size: 14px; color: #475569;">
            <strong>${escapeHtml(resolvedName)}</strong> (${escapeHtml(resolvedEmail || "N/A")}) has submitted their ${escapeHtml(type)} for compliance verification.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://i-vantage.in/admin/professionals" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Review & Approve →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: adminEmails,
        subject: adminSubject,
        html: adminHtml,
        attachments: logoAttachments,
      });
      console.log(`[Email] SuperAdmin profile review alert sent to ${adminEmails.join(", ")} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send admin review submission alert:", err.message);
    }
  }

  // 2. Professional Confirmation
  if (resolvedEmail) {
    const proSubject = `Your Profile Has Been Submitted for Review — i-VANTAGE`;
    const proHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Compliance & Verification Desk" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">Submission Received</h2>
          <p style="margin: 0 0 16px; font-size: 14px; color: #475569;">
            Hello ${escapeHtml(resolvedName)}, your ${escapeHtml(type)} is currently under review by our compliance team. You will be notified via email once your profile is verified and published.
          </p>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      const info = await mailService.transporter.sendMail({
        from: mailService.from,
        to: resolvedEmail,
        subject: proSubject,
        html: proHtml,
        attachments: logoAttachments,
      });
      console.log(`[Email] Professional review submission confirmation sent to ${resolvedEmail} (msgId: ${info.messageId})`);
    } catch (err) {
      console.error("Failed to send pro review submission confirmation:", err.message);
    }
  }
}

/**
 * 6. Professional Approval / Rejection Decision Notifications
 */
export async function sendProfessionalApprovalDecisionNotifications({
  name,
  proName,
  email,
  proEmail,
  status, // "APPROVED" | "REJECTED" | "SUSPENDED"
  reason = "",
}) {
  const mailService = getTransporter();
  const resolvedName = proName || name || "Professional Partner";
  const resolvedEmail = proEmail || email;

  if (!mailService || !resolvedEmail) return;

  const logoAttachments = getLogoAttachment();
  const isApproved = status === "APPROVED";
  const subject = isApproved
    ? `Congratulations! Your i-VANTAGE Professional Profile is Approved & Live`
    : `Update on Your i-VANTAGE Professional Profile`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
      ${getEmailHeaderHtml({ badgeText: "Compliance & Verification Desk" })}
      <div style="padding: 28px 24px; color: #1e293b;">
        <h2 style="margin: 0 0 16px; color: ${isApproved ? "#047857" : "#b91c1c"}; font-size: 19px; font-weight: 700;">
          ${isApproved ? "✓ Profile Approved & Published" : "Profile Status Update"}
        </h2>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #475569;">
          Hello <strong>${escapeHtml(resolvedName)}</strong>,
        </p>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #475569;">
          ${
            isApproved
              ? "Your professional profile has successfully passed compliance verification and is now live on India's premier business hub platform."
              : `Your profile submission requires changes or has been set to ${escapeHtml(status)}. Reason: <em>"${escapeHtml(reason)}"</em>`
          }
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://i-vantage.in/dashboard/professional/profile" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
            Go to Profile Dashboard →
          </a>
        </div>
      </div>
      ${getEmailFooterHtml()}
    </div>
  `;

  try {
    const info = await mailService.transporter.sendMail({
      from: mailService.from,
      to: resolvedEmail,
      subject,
      html,
      attachments: logoAttachments,
    });
    console.log(`[Email] Professional decision email (${status}) sent to ${resolvedEmail} (msgId: ${info.messageId})`);
  } catch (err) {
    console.error("Failed to send professional approval decision email:", err.message);
  }
}

/**
 * 7. Workspace Listing Submission Notifications
 */
export async function sendListingSubmissionNotifications({
  listingTitle,
  city = "Gurugram",
  price,
  vendorBusinessName,
  vendorEmail,
}) {
  const mailService = getTransporter();
  const adminEmails = await getSuperAdminEmails();
  const logoAttachments = getLogoAttachment();

  if (!mailService) return;

  // 1. SuperAdmin Alert
  if (adminEmails.length > 0) {
    const adminSubject = `[Listing Moderation] New Space "${listingTitle}" Submitted by ${vendorBusinessName || "Vendor"}`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "SuperAdmin Desk • Listing Moderation" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Workspace Listing Pending Review</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 32%;">Space Title:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66;">${escapeHtml(listingTitle)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">City:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(city)}</td>
              </tr>
              ${price ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Price:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #047857;">₹${Number(price).toLocaleString("en-IN")}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Vendor:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(vendorBusinessName || "Vendor Partner")} (${escapeHtml(vendorEmail || "N/A")})</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://i-vantage.in/admin/listings" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Review in Listing Desk →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      await mailService.transporter.sendMail({
        from: mailService.from,
        to: adminEmails,
        subject: adminSubject,
        html: adminHtml,
        attachments: logoAttachments,
      });
    } catch (err) {
      console.error("Failed to send admin listing submission alert:", err.message);
    }
  }

  // 2. Vendor Confirmation
  if (vendorEmail) {
    const vendorSubject = `Listing Submitted for Review: "${listingTitle}" — i-VANTAGE`;
    const vendorHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Vendor Partner Portal" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">Workspace Listing Received</h2>
          <p style="margin: 0 0 16px; font-size: 14px; color: #475569;">
            Your listing <strong>"${escapeHtml(listingTitle)}"</strong> has been submitted and is currently being reviewed by our commercial moderation team. You will be notified once it is approved and live.
          </p>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      await mailService.transporter.sendMail({
        from: mailService.from,
        to: vendorEmail,
        subject: vendorSubject,
        html: vendorHtml,
        attachments: logoAttachments,
      });
    } catch (err) {
      console.error("Failed to send vendor listing confirmation:", err.message);
    }
  }
}

/**
 * 8. Workspace Listing Decision Notifications
 */
export async function sendListingReviewDecisionNotifications({
  listingTitle,
  vendorEmail,
  status, // "approved" | "rejected"
  rejectionReason = "",
  liveUrl = "",
}) {
  const mailService = getTransporter();
  if (!mailService || !vendorEmail) return;

  const logoAttachments = getLogoAttachment();
  const isApproved = status === "approved";
  const subject = isApproved
    ? `Workspace Listing Approved & Live: "${listingTitle}" — i-VANTAGE`
    : `Update on Workspace Listing: "${listingTitle}" — i-VANTAGE`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
      ${getEmailHeaderHtml({ badgeText: "Vendor Partner Portal" })}
      <div style="padding: 28px 24px; color: #1e293b;">
        <h2 style="margin: 0 0 16px; color: ${isApproved ? "#047857" : "#b91c1c"}; font-size: 19px; font-weight: 700;">
          ${isApproved ? "✓ Workspace Listing Approved & Live" : "Listing Review Update"}
        </h2>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #475569;">
          ${
            isApproved
              ? `Your workspace listing <strong>"${escapeHtml(listingTitle)}"</strong> has been approved and published live.`
              : `Your workspace listing <strong>"${escapeHtml(listingTitle)}"</strong> requires updates. Reason: <em>"${escapeHtml(rejectionReason)}"</em>`
          }
        </p>
        ${
          liveUrl
            ? `<div style="text-align: center; margin-top: 24px;">
            <a href="${liveUrl}" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              View Live Listing →
            </a>
          </div>`
            : ""
        }
      </div>
      ${getEmailFooterHtml()}
    </div>
  `;

  try {
    await mailService.transporter.sendMail({
      from: mailService.from,
      to: vendorEmail,
      subject,
      html,
      attachments: logoAttachments,
    });
  } catch (err) {
    console.error("Failed to send listing review decision email:", err.message);
  }
}

/**
 * 9. Role Change Security Notification
 */
export async function sendRoleChangeNotification({ email, fullName, previousRole, newRole, changedBy }) {
  const mailService = getTransporter();
  if (!mailService || !email) return { sent: false };

  const formatRole = (r) => {
    switch (r) {
      case "super_admin":
      case "superadmin":
        return "Super Administrator";
      case "vendor":
        return "Vendor Partner";
      case "professional":
        return "Verified Professional";
      case "user":
        return "Standard User";
      default:
        return r || "Member";
    }
  };

  const roleTitle = formatRole(newRole);
  const prevTitle = formatRole(previousRole);
  const logoAttachments = getLogoAttachment();

  const subject = `Security Alert: Your i-VANTAGE Account Role Has Been Updated`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
      ${getEmailHeaderHtml({ badgeText: "Account Security & Access Notice" })}
      <div style="padding: 28px 24px; color: #1e293b;">
        <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #0f172a;">Hello ${escapeHtml(fullName || "Member")},</h2>
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
          Your account role on the <strong>i-VANTAGE</strong> platform has been modified by an administrator (<strong>${escapeHtml(changedBy || "System Admin")}</strong>).
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 7px 0; color: #64748b; width: 35%;">Previous Role:</td>
              <td style="padding: 7px 0; font-weight: 600; color: #64748b;">${escapeHtml(prevTitle)}</td>
            </tr>
            <tr>
              <td style="padding: 7px 0; color: #64748b;">New Active Role:</td>
              <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF; font-size: 15px;">${escapeHtml(roleTitle)}</td>
            </tr>
          </table>
        </div>
      </div>
      ${getEmailFooterHtml()}
    </div>
  `;

  try {
    await mailService.transporter.sendMail({
      from: mailService.from,
      to: email,
      subject,
      html,
      attachments: logoAttachments,
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send role change email:", err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * 10. Newsletter Subscriber Welcome Confirmation Email
 */
export async function sendNewsletterWelcomeEmail({ email }) {
  const mailService = getTransporter();
  if (!mailService || !email) return { sent: false };

  const logoAttachments = getLogoAttachment();
  const subject = `Welcome to i-VANTAGE Priority Dispatch & Center Drops`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
      ${getEmailHeaderHtml({ badgeText: "Priority Dispatch • Member Perks", title: "i-VANTAGE Hub" })}
      <div style="padding: 32px 24px; color: #1e293b;">
        <div style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 18px;">
          ✓ Subscription Confirmed
        </div>
        <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a;">You're On The Priority List</h2>
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for subscribing with <strong>${escapeHtml(email)}</strong>. You now have priority access to commercial workspace releases and member-only pricing across India's top business hubs.
        </p>
      </div>
      ${getEmailFooterHtml()}
    </div>
  `;

  try {
    const info = await mailService.transporter.sendMail({
      from: mailService.from,
      to: email,
      subject,
      html,
      attachments: logoAttachments,
    });
    console.log(`[Email] Newsletter welcome sent to ${email} (msgId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("Failed to send newsletter welcome email:", err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * 11. Newsletter Admin Lead Alert (Broadcast to all SuperAdmins)
 */
export async function sendNewsletterAdminAlert({ email, source = "footer" }) {
  const mailService = getTransporter();
  const adminEmails = await getSuperAdminEmails();
  if (!mailService || adminEmails.length === 0) return { sent: false };

  const logoAttachments = getLogoAttachment();
  const subject = `[New Subscriber] ${email} joined Priority Dispatch`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
      ${getEmailHeaderHtml({ badgeText: "Admin Desk • Subscriber Captured" })}
      <div style="padding: 28px 24px; color: #1e293b;">
        <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Newsletter Subscriber Captured</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 7px 0; color: #64748b; width: 30%;">Subscriber Email:</td>
              <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="padding: 7px 0; color: #64748b;">Source:</td>
              <td style="padding: 7px 0; font-weight: 600; color: #334155;">Website ${escapeHtml(source)}</td>
            </tr>
          </table>
        </div>
      </div>
      ${getEmailFooterHtml()}
    </div>
  `;

  try {
    const info = await mailService.transporter.sendMail({
      from: mailService.from,
      to: adminEmails,
      subject,
      html,
      attachments: logoAttachments,
    });
    console.log(`[Email] SuperAdmin newsletter subscriber alert sent to ${adminEmails.join(", ")} (msgId: ${info.messageId})`);
    return { sent: true };
  } catch (err) {
    console.error("Failed to send newsletter admin alert email:", err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Generic Mail Sender
 */
export async function sendEmail({ to, subject, html, text }) {
  const mailService = getTransporter();
  if (!mailService || !to) {
    console.warn("[Email] Mail service unconfigured or missing recipient:", to);
    return { sent: false };
  }

  const logoAttachments = getLogoAttachment();
  try {
    const info = await mailService.transporter.sendMail({
      from: mailService.from,
      to,
      subject,
      html,
      text: text || undefined,
      attachments: logoAttachments,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email] Failed to send email to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
}
