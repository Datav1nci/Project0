import { google } from 'googleapis';
import axios from 'axios';
import DatabaseService from '../lib/database';
import { Notification, Alert } from '../types';
import { AppError } from '../lib/errors';

export class NotificationService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async sendEmailNotification(alert: Alert, client: { email: string; name: string }): Promise<void> {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Assume token is retrieved from oauth_tokens table
    const token = await this.getOAuthToken();
    oauth2Client.setCredentials(token);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const emailContent = `
      Subject: Reminder: ${alert.title}
      To: ${client.email}
      
      Dear ${client.name},
      Your ${alert.title} is due on ${alert.due_date.toDateString()}.
      Description: ${alert.description}
      
      Regards,
      Client Management SaaS
    `;
    const encodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    try {
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedEmail },
      });
      await this.logNotification({
        alert_id: alert.id,
        client_id: alert.client_id,
        type: 'email',
        content: emailContent,
        status: 'sent',
        sent_at: new Date(),
      });
    } catch (error) {
      throw new AppError(500, 'Failed to send email', error.message);
    }
  }

  async sendSMSNotification(alert: Alert, client: { phone: string }): Promise<void> {
    const url = 'https://voip.ms/api/v1/rest.php';
    const params = {
      api_username: process.env.VOIPMS_USERNAME,
      api_password: process.env.VOIPMS_PASSWORD,
      method: 'sendSMS',
      did: process.env.VOIPMS_DID,
      dst: client.phone,
      message: `Reminder: ${alert.title} due on ${alert.due_date.toDateString()}.`,
    };

    try {
      const response = await axios.get(url, { params });
      if (response.data.status !== 'success') {
        throw new Error(response.data.message);
      }
      await this.logNotification({
        alert_id: alert.id,
        client_id: alert.client_id,
        type: 'sms',
        content: params.message,
        status: 'sent',
        sent_at: new Date(),
      });
    } catch (error) {
      throw new AppError(500, 'Failed to send SMS', error.message);
    }
  }

  private async logNotification(notification: Omit<Notification, 'id'>): Promise<void> {
    const query = `
      INSERT INTO notifications (alert_id, client_id, type, content, status, sent_at)
      VALUES (:alert_id, :client_id, :type, :content, :status, :sent_at)
    `;
    await this.db.execute(query, notification);
  }

  private async getOAuthToken(): Promise<any> {
    const query = 'SELECT access_token, refresh_token, expires_at FROM oauth_tokens WHERE provider = :provider';
    const result = await this.db.execute(query, { provider: 'gmail' });
    return result.rows?.[0];
  }
}