import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './Dtos/create-users.dto';
import { getErrorCodeAndMessage } from 'src/helpers';
import { ResendOtpDto } from './Dtos/resend-otp-dto';
import { LeadService } from './lead.service';
import { SigninUserDto } from './Dtos/signin-user.dto';

const sgMail = require('@sendgrid/mail');

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly leadService: LeadService,
  ) {}

  @Post('signup')
  async initiateSignup(@Body() body: CreateUserDto) {
    try {
      const user = await this.userService.findUserBy({
        email: body.email,
      });

      if (user) {
        return 'email already registered';
      }

      const lead = await this.userService.createLead(body);

      await this.userService.sendOtp({ email: body.email });
      return {
        message: 'success',
        lead,
      };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/confirm-otp')
  async confirmOtp(@Body() otp: string, email: string) {
    try {
      const isOtpConfirmed = await this.userService.ConfirmOtp(otp, email);

      if (!isOtpConfirmed.success) {
        return {
          message: 'Invalid Otp',
        };
      }

      const lead = await this.leadService.findLead({
        where: {
          email,
        },
      });

      const user = await this.userService.create({
        firstName: lead.leadData.firstName,
        lastName: lead.leadData.lastName,
        email: lead.leadData.email,
        password: lead.leadData.password,
      });

      if (user) {
        this.leadService.DeleteLead(lead.leadData.id);
      }

      return {
        message: 'success',
        user,
      };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Post auth/signin
  @Post('signin')
  async signin(@Body() body: SigninUserDto) {
    try {
      console.log(body.email);

      const login = await this.userService.logIn(body);
      console.log(login);
      if (login.success) {
        return 'logged in successfully';
      }

      return login.message;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/resend-otp')
  async resendOtp(@Body('') resendOtpPayload: ResendOtpDto) {
    try {
      await this.userService.sendOtp({ email: resendOtpPayload.email });
      return {
        message: 'success',
      };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
