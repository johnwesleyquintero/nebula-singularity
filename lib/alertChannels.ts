import nodemailer from 'nodemailer';
import { WebClient } from '@slack/web-api';
import { logger } from './errorHandling';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
};

// Slack configuration
const slackConfig = {
  token: process.env.SLACK_BOT_TOKEN,
  channel: process.env.SLACK_CHANNEL_ID
};

// Initialize email transport
const emailTransport = nodemailer.createTransport(emailConfig);

// Initialize Slack client
const slackClient = new WebClient(slackConfig.token);

// Alert templates
const alertTemplates = {
  email: {
    subject: '[ALERT] Error Notification from Nebula-Singularity',
    body: (message: string) => `
      <h2>Alert Notification</h2>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `
  },
  slack: {
    blocks: (message: string) => [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Alert Notification'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:* ${message}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Timestamp:* ${new Date().toISOString()}`
          }
        ]
      }
    ]
  }
};

// Send email alert
export const sendEmailAlert = async (message: string): Promise<void> => {
  try {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: process.env.ALERT_EMAIL_RECIPIENTS || 'admin@example.com',
      subject: alertTemplates.email.subject,
      html: alertTemplates.email.body(message)
    };

    await emailTransport.sendMail(mailOptions);
    logger.info('Email alert sent successfully', { message });
  } catch (error) {
    logger.error('Failed to send email alert', { error, message });
    throw error;
  }
};

// Send Slack alert
export const sendSlackAlert = async (message: string): Promise<void> => {
  try {
    await slackClient.chat.postMessage({
      channel: slackConfig.channel,
      blocks: alertTemplates.slack.blocks(message),
      text: message // Fallback text
    });
    logger.info('Slack alert sent successfully', { message });
  } catch (error) {
    logger.error('Failed to send Slack alert', { error, message });
    throw error;
  }
};

// Channel handler map
export const alertChannelHandlers = new Map<string, (message: string) => Promise<void>>([
  ['email', sendEmailAlert],
  ['slack', sendSlackAlert]
]);