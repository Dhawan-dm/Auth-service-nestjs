import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { sendMail } from 'src/helpers';

const sgMail = require('@sendgrid/mail');

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepo: Repository<Otp>,
  ) {}

  async CreateOtp(createPayload: Omit<Otp, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.otpRepo.save(createPayload);
  }

  async FindOtp(filter: FindOneOptions<Otp>) {
    try {
      const otpData = await this.otpRepo.findOne(filter);

      if (otpData) {
        return {
          success: true,
          data: {
            otpToken: otpData.otpToken,
            updatedAt: otpData.updatedAt,
          },
        };
      }
      return {
        success: false,
      };
    } catch (error) {}
  }

  async DeleteOtp(email: string) {
    return this.otpRepo.delete({
      email,
    });
  }
}
