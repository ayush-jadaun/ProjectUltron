// notifications/sendAlertEmails.js
import sequelize from "../db/db.js";
import AnalysisResult from "../models/AnalysisResult.js";
import User from "../models/user.model.js";
import UserSubscription from "../models/userSubscription.model.js";
import { sendEmail } from "../utils/emailService.js"; // You already have this utility
import dotenv from "dotenv";
dotenv.config();

/**
 * Processes new analysis results and sends email alerts when thresholds are exceeded
 */
async function sendAlertEmails() {
  console.log("--- Starting Alert Email Processing ---");

  try {
    // Find all unprocessed analysis results that triggered alerts
    const alertResults = await AnalysisResult.findAll({
      where: {
        alert_triggered: true,
        notification_sent: null, // Add this field to your AnalysisResult model
      },
      include: [
        {
          model: User,
          attributes: ["id", "email", "name"],
        },
        {
          model: UserSubscription,
          attributes: ["subscription_name", "region_geometry"],
        },
      ],
    });

    console.log(`Found ${alertResults.length} new alerts to process`);

    for (const result of alertResults) {
      try {
        if (!result.User || !result.User.email) {
          console.log(`Missing user data for analysis result ${result.id}`);
          continue;
        }

        // Generate appropriate alert content based on type
        const emailContent = generateAlertEmailContent(result);

        // Send email
        await sendEmail({
          to: result.User.email,
          subject: `Environmental Alert: ${emailContent.subject}`,
          text: emailContent.text,
          html: emailContent.html,
        });

        // Mark as processed
        result.notification_sent = new Date();
        await result.save();

        console.log(
          `Alert email sent to ${result.User.email} for ${result.analysis_type}`
        );
      } catch (emailError) {
        console.error(`Error processing alert ${result.id}:`, emailError);
      }
    }

    console.log("--- Alert Email Processing Completed ---");
  } catch (error) {
    console.error("Error in alert email processing:", error);
  }
}

/**
 * Generates email content based on the type of environmental alert
 */
function generateAlertEmailContent(result) {
  const userName = result.User.name || "User";
  const subscriptionName =
    result.UserSubscription?.subscription_name || "your monitored area";
  const analysisType = result.analysis_type;
  const calculatedValue = result.calculated_value;
  const thresholdValue = result.threshold_value;

  let subject, description, recommendations;

  switch (analysisType) {
    case "DEFORESTATION":
      subject = `Significant Deforestation Detected in ${subscriptionName}`;
      description = `Our analysis has detected a significant decrease in forest cover (${(
        calculatedValue * 100
      ).toFixed(2)}%) in your monitored area.`;
      recommendations = [
        "Review recent satellite imagery of the area",
        "Consider contacting local environmental authorities",
        "Monitor the area for continued changes",
      ];
      break;

    case "SEA_LEVEL_RISE":
      subject = `Sea Level Rise Alert for ${subscriptionName}`;
      description = `Our analysis has detected significant sea level changes in your monitored area.`;
      recommendations = [
        "Review flood risk assessments for the region",
        "Consider additional monitoring for coastal erosion",
        "Check local climate adaptation plans",
      ];
      break;

    // Add cases for other environmental issues

    default:
      subject = `Environmental Alert for ${subscriptionName}`;
      description = `Our monitoring system has detected significant changes that exceed your set thresholds.`;
      recommendations = [
        "Review the data in your dashboard",
        "Consider adjusting your alert thresholds if needed",
      ];
  }

  // Create text and HTML versions
  const text = `
Hello ${userName},

${subject}

${description}

Recent value: ${calculatedValue}
Threshold: ${thresholdValue}

Recommendations:
${recommendations.map((rec) => `- ${rec}`).join("\n")}

View more details in your dashboard: ${process.env.CLIENT_URL}/dashboard

This is an automated alert from Project Ultron.
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3498db; color: white; padding: 10px 20px; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .footer { font-size: 12px; color: #666; margin-top: 20px; }
    .button { background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Project Ultron - Environmental Alert</h2>
    </div>
    <div class="content">
      <p>Hello ${userName},</p>
      
      <h3>${subject}</h3>
      <p>${description}</p>
      
      <p><strong>Recent value:</strong> ${calculatedValue}<br>
      <strong>Threshold:</strong> ${thresholdValue}</p>
      
      <h4>Recommendations:</h4>
      <ul>
        ${recommendations.map((rec) => `<li>${rec}</li>`).join("")}
      </ul>
      
      <p style="margin-top: 30px;">
        <a href="${
          process.env.CLIENT_URL
        }/dashboard" class="button">View Details in Dashboard</a>
      </p>
    </div>
    <div class="footer">
      <p>This is an automated alert from Project Ultron. You are receiving this because you subscribed to environmental alerts.</p>
    </div>
  </div>
</body>
</html>
`;

  return { subject, text, html };
}

// Run directly or schedule using a cron job
if (require.main === module) {
  sequelize
    .authenticate()
    .then(() => {
      console.log(
        "Database connection verified. Starting email notifications..."
      );
      sendAlertEmails().finally(() => {
        console.log("Email notification process complete.");
        process.exit(0);
      });
    })
    .catch((err) => {
      console.error(
        "Database connection failed. Cannot send notifications:",
        err
      );
      process.exit(1);
    });
}

export default sendAlertEmails;
