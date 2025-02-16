import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ReservationEntity } from '../reservation/entities/reservation.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: `"No Reply" <${process.env.MAIL_FROM}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>${subject}</h2>
          <p>${text.replace(/\n/g, '<br>')}</p>
          <p>Thank you for using our service!</p>
        </div>
      `,
    });

    console.log('Email sent, infos: ', info);
  }

  async sendDeleteMail(
    user: UserEntity,
    admin: UserEntity | null,
    classroom: ClassroomEntity,
    oldReservation: ReservationEntity,
  ) {
    const userEmailText = `
      Your reservation for classroom <strong>${classroom.name}</strong> has been deleted.<br><br>
      <strong>Deleted Reservation:</strong><br>
      Start Time: <i>${oldReservation.startTime}</i><br>
      End Time: <i>${oldReservation.endTime}</i><br><br>
    `;
    const adminEmailText = `
      The reservation for user <strong>${user.email}</strong> in classroom <strong>${classroom.name}</strong> has been deleted.<br><br>
      <strong>Deleted Reservation:</strong><br>
      Start Time: <i>${oldReservation.startTime}</i><br>
      End Time: <i>${oldReservation.endTime}</i><br><br>
    `;
    if (admin) {
      await this.sendMail(admin.email, 'Reservation deleted', adminEmailText);
    }
    await this.sendMail(user.email, 'Important: Your reservation has been deleted', userEmailText);
  }
}
