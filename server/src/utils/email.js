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
 * 1. Marketplace Lead Notifications (Client confirmation, Vendor alert, SuperAdmin alert)
 */
export async function sendLeadNotifications(payload) {
  const results = {
    clientSent: false,
    vendorSent: false,
    adminSent: false,
  };

  const mailService = getTransporter();
  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL || OFFICIAL_CONTACT.email;
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

    if (mailService) {
      try {
        const info = await mailService.transporter.sendMail({
          from: mailService.from,
          to: payload.clientEmail,
          subject: clientSubject,
          html: clientHtml,
          attachments: logoAttachments,
        });
        results.clientSent = true;
        console.log(`[Email] Client confirmation sent successfully to ${payload.clientEmail} (msgId: ${info.messageId})`);
      } catch (err) {
        console.error("Failed to send client confirmation email:", err.message);
      }
    }
  }

  // 2. Vendor Partner Alert Email
  const vendorTargetEmail = payload.vendorEmail;
  if (vendorTargetEmail) {
    const vendorSubject = `⚡ New Space Tour Enquiry: ${dynamicSpaceTitle} — i-VANTAGE`;
    const vendorHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Partner Portal • Lead Alert" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <div style="display: inline-block; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 16px;">
            ⚡ New Space Tour Enquiry
          </div>
          <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #0f172a;">New Enquiry for ${escapeHtml(dynamicSpaceTitle)}</h2>
          <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.5;">
            A verified prospective client has submitted an enquiry for your space listing on <strong>i-VANTAGE Hub</strong>.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 32%;">Client Name:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(payload.clientName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">
                  <a href="tel:${escapeHtml(payload.clientPhone)}" style="color: #1E5BFF; text-decoration: none;">${escapeHtml(payload.clientPhone)}</a>
                </td>
              </tr>
              ${
                payload.clientEmail
                  ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">
                  <a href="mailto:${escapeHtml(payload.clientEmail)}" style="color: #0f172a; text-decoration: none;">${escapeHtml(payload.clientEmail)}</a>
                </td>
              </tr>`
                  : ""
              }
              ${
                payload.clientMessage
                  ? `<tr>
                <td style="padding: 7px 0; color: #64748b; vertical-align: top;">Requirement:</td>
                <td style="padding: 7px 0; color: #334155; font-style: italic;">"${escapeHtml(payload.clientMessage)}"</td>
              </tr>`
                  : ""
              }
            </table>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://i-vantage.in/vendor/leads" style="display: inline-block; background: #1E5BFF; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px;">
              Open Partner Leads Dashboard →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    if (mailService) {
      try {
        await mailService.transporter.sendMail({
          from: mailService.from,
          to: vendorTargetEmail,
          subject: vendorSubject,
          html: vendorHtml,
          attachments: logoAttachments,
        });
        results.vendorSent = true;
      } catch (err) {
        console.error("Failed to send vendor alert email:", err.message);
      }
    }
  }

  // 3. SuperAdmin Lead Notification
  if (adminEmail) {
    const adminSubject = `[Marketplace Enquiry] ${dynamicSpaceTitle} — ${payload.clientName}`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Admin Desk • Lead Alert" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Marketplace Lead Submitted</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 30%;">Client:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(payload.clientName)} (${escapeHtml(payload.clientPhone)})</td>
              </tr>
              ${payload.clientEmail ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(payload.clientEmail)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Workspace:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">${escapeHtml(dynamicSpaceTitle)}</td>
              </tr>
              ${payload.spaceLocation ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Location:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(payload.spaceLocation)}</td>
              </tr>` : ""}
              ${payload.vendorBusinessName ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Vendor:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(payload.vendorBusinessName)} (${escapeHtml(payload.vendorEmail || "N/A")})</td>
              </tr>` : ""}
              ${payload.clientMessage ? `<tr>
                <td style="padding: 7px 0; color: #64748b; vertical-align: top;">Notes:</td>
                <td style="padding: 7px 0; color: #475569; font-style: italic;">"${escapeHtml(payload.clientMessage)}"</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://i-vantage.in/admin/leads" style="display: inline-block; background: #0A1F66; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
              Manage in Admin Workspace →
            </a>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    if (mailService) {
      try {
        const info = await mailService.transporter.sendMail({
          from: mailService.from,
          to: adminEmail,
          subject: adminSubject,
          html: adminHtml,
          attachments: logoAttachments,
        });
        results.adminSent = true;
        console.log(`[Email] Admin lead alert sent successfully to ${adminEmail} (msgId: ${info.messageId})`);
      } catch (err) {
        console.error("Failed to send admin lead email:", err.message);
      }
    }
  }

  return results;
}

/**
 * 2. Role Change Security Notification
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
            <tr>
              <td style="padding: 7px 0; color: #64748b;">Session Status:</td>
              <td style="padding: 7px 0; font-weight: 600; color: #ef4444;">Previous sessions invalidated</td>
            </tr>
          </table>
        </div>

        <div style="background: #eff6ff; border-left: 4px solid #1E5BFF; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
            <strong>Important:</strong> For security reasons, all active sessions have been automatically terminated. Please log in again using the appropriate portal for your new role.
          </p>
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
 * 3. General CRM / Contact Form Enquiry Notification
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
  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL || OFFICIAL_CONTACT.email;
  const logoAttachments = getLogoAttachment();

  const results = { clientSent: false, adminSent: false };

  // Client confirmation
  if (email) {
    const subject = `Enquiry Received: ${serviceName} — i-VANTAGE Business Hub`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Business Solutions & Workspace Concierge" })}
        <div style="padding: 32px 24px; color: #1e293b;">
          <div style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 18px;">
            ✓ Enquiry Confirmed
          </div>
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a;">Hello ${escapeHtml(fullName)},</h2>
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
                <td style="padding: 7px 0; color: #64748b; font-weight: 500;">Hub Location:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #334155;">${escapeHtml(location)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b; font-weight: 500;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(mobile)}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #1E5BFF; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
              Our dedicated account advisory team will review your requirement and reach out shortly to discuss tailored commercial packages and assistance.
            </p>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    if (mailService) {
      try {
        await mailService.transporter.sendMail({
          from: mailService.from,
          to: email,
          subject,
          html,
          attachments: logoAttachments,
        });
        results.clientSent = true;
      } catch (err) {
        console.error("Failed to send CRM client email:", err.message);
      }
    }
  }

  // Admin notification
  if (adminEmail && mailService) {
    const adminSubject = `[General Enquiry] ${serviceName} — ${fullName}`;
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
        ${getEmailHeaderHtml({ badgeText: "Admin Desk • Business Enquiry" })}
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 16px; color: #0A1F66; font-size: 18px; font-weight: 700;">New Business Enquiry Logged</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 30%;">Client Name:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0f172a;">${escapeHtml(fullName)}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #1E5BFF;">${escapeHtml(mobile)}</td>
              </tr>
              ${email ? `<tr>
                <td style="padding: 7px 0; color: #64748b;">Email:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${escapeHtml(email)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Service:</td>
                <td style="padding: 7px 0; font-weight: 700; color: #0A1F66;">${escapeHtml(serviceName)}</td>
              </tr>
              ${message ? `<tr>
                <td style="padding: 7px 0; color: #64748b; vertical-align: top;">Message:</td>
                <td style="padding: 7px 0; color: #475569; font-style: italic;">"${escapeHtml(message)}"</td>
              </tr>` : ""}
            </table>
          </div>
        </div>
        ${getEmailFooterHtml()}
      </div>
    `;

    try {
      await mailService.transporter.sendMail({
        from: mailService.from,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
        attachments: logoAttachments,
      });
      results.adminSent = true;
    } catch (err) {
      console.error("Failed to send CRM admin email:", err.message);
    }
  }

  return results;
}
