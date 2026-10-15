import Subscriber from "./subscriber.model.js";
import {
  sendNewsletterWelcomeEmail,
  sendNewsletterAdminAlert,
} from "../../utils/email.js";
import { createNotification } from "../notifications/notification.service.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public: POST /api/v1/newsletter/subscribe
 * Subscribes an email to the priority commercial inventory dispatch
 */
export const subscribe = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;
    const source = req.body.source || "footer";

    if (!rawEmail || typeof rawEmail !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required.",
      });
    }

    const email = rawEmail.trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email format.",
      });
    }

    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "active") {
        return res.status(200).json({
          success: true,
          alreadySubscribed: true,
          message: "You are already subscribed to priority updates!",
          data: { email: subscriber.email },
        });
      }

      // Re-activate previously unsubscribed email
      subscriber.status = "active";
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = null;
      subscriber.source = source;
      await subscriber.save();
    } else {
      // Create new subscriber
      subscriber = await Subscriber.create({
        email,
        source,
        status: "active",
        metadata: {
          ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
          userAgent: req.headers["user-agent"] || "",
        },
      });
    }

    // 1. Asynchronously send subscriber branded welcome email (Non-blocking)
    sendNewsletterWelcomeEmail({ email }).catch((err) =>
      console.error("[Newsletter] Failed to dispatch welcome email:", err.message)
    );

    // 2. Asynchronously notify SuperAdmin via email
    sendNewsletterAdminAlert({ email, source }).catch((err) =>
      console.error("[Newsletter] Failed to dispatch admin alert email:", err.message)
    );

    // 3. Create live in-app notification for Admin Dashboard bell icon
    createNotification({
      title: "New Newsletter Subscriber",
      message: `${email} joined Priority Dispatch via ${source}.`,
      category: "lead",
      priority: "normal",
      actionUrl: "/admin/leads",
      metadata: { email, source, subscriberId: subscriber._id.toString() },
    }).catch((err) =>
      console.error("[Newsletter] Failed to create in-app notification:", err.message)
    );

    return res.status(201).json({
      success: true,
      message: "Subscription confirmed! Welcome email has been sent.",
      data: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: POST /api/v1/newsletter/unsubscribe
 */
export const unsubscribe = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;

    if (!rawEmail || typeof rawEmail !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email address is required to unsubscribe.",
      });
    }

    const email = rawEmail.trim().toLowerCase();

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { status: "unsubscribed", unsubscribedAt: new Date() },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found with this email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have been successfully unsubscribed.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * SuperAdmin: GET /api/v1/newsletter/subscribers
 */
export const getSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [subscribers, total] = await Promise.all([
      Subscriber.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Subscriber.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: subscribers,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
