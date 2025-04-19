import nodemailer from "nodemailer";

export async function sendAlertNotification({
  user,
  subscriptionId,
  analysisType,
  details,
}) {
  if (!user || !user.email) {
    console.warn("No user or user email for alert notification.");
    return;
  }

  // Configure your SMTP transporter (update credentials as needed)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
  });

  const subject = `[ALERT] ${analysisType} triggered for Subscription #${subscriptionId}`;
  const text = `Dear ${user.name || user.email},

An alert was triggered for your subscription.

Type: ${analysisType}
Details: ${details}

Please check your dashboard for more information.`;

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: user.email,
    subject,
    text,
  });

  console.log(
    `Alert email sent to ${user.email} for subscription ${subscriptionId}`
  );
}
