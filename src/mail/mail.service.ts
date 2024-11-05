import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPriceAlert(
    email: string,
    chain: string,
    changePercent: number,
    currentPrice: number,
    tokenAddress: string,
  ) {
    await this.transporter.sendMail({
      to: email,
      subject: `Price Alert: ${changePercent.toFixed(2)}% change detected`,
      text: `A price change of ${changePercent.toFixed(2)}% has been detected for token ${tokenAddress} on chain ${chain}. Current price: $${currentPrice}`,
    });
  }

  async sendTargetPriceAlert(
    email: string,
    chain: string,
    targetPrice: number,
    currentPrice: number,
  ) {
    await this.transporter.sendMail({
      to: email,
      subject: `Target Price Alert: ${chain} reached ${targetPrice}`,
      text: `The price of ${chain} has reached your target price of $${targetPrice}. Current price: $${currentPrice}`,
    });
  }
}
