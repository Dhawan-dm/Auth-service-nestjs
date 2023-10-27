import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserTypes } from 'src/Types';
import { OtpService } from './otp.service';
import { sendMail } from 'src/helpers';
import { LeadService } from './lead.service';
import { CreateUserDto } from './Dtos/create-users.dto';
import { SALT_ROUNDS } from 'src/constants';
import { SigninUserDto } from './Dtos/signin-user.dto';
import { S3Service } from 'src/s3/s3.service';
import { v4 as uuidv4 } from 'uuid';

const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly otpService: OtpService,
    private readonly leadService: LeadService,
    private readonly s3Service: S3Service,
  ) {}

  async create(CreateUserDto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{
    user?: User | null;
  }> {
    const userBody = {
      firstName: CreateUserDto.firstName,
      lastName: CreateUserDto.lastName,
      email: CreateUserDto.email,
      password: CreateUserDto.password,
    };
    const userData = await this.userRepository.save(userBody);

    return {
      user: userData,
    };
  }

  async findUserBy({ email }: { email: string }): Promise<UserTypes> {
    console.log(email);

    const userData = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!userData) {
      return null;
    }

    return userData;
  }

  async logIn({ email, password }: SigninUserDto) {
    try {
      console.log(email);

      const user = await this.findUserBy({
        email,
      });

      console.log(user);

      if (!user) {
        return {
          success: false,
          message: 'user does not exist',
        };
      }

      const isMatching = await bcrypt.compareSync(password, user.password);
      console.log(isMatching);

      if (isMatching) {
        return {
          success: true,
          message: 'User logged in',
        };
      }
      return {
        success: false,
        message: 'invalid password',
      };
    } catch {}
  }

  async sendOtp({ email }: { email: string }) {
    try {
      let otpToken = '';

      const otpData = await this.otpService.FindOtp({
        where: {
          email,
        },
      });

      const now = new Date();

      if (otpData.success) {
        const lastUpdatedAt = new Date(otpData.data.updatedAt);
        if (now.getMinutes() - lastUpdatedAt.getMinutes() < 10) {
          otpToken = otpData.data.otpToken;
        } else {
          await this.otpService.DeleteOtp(email);
        }
      }

      if (!otpToken.length) {
        otpToken = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
        });
        await this.otpService.CreateOtp({
          email,
          otpToken,
        });
      }

      sendMail(otpToken);
    } catch {}
  }

  async ConfirmOtp(otp: string, email: string) {
    try {
      const confirmOtp = await this.otpService.FindOtp({
        where: {
          otpToken: otp,
          email,
        },
      });

      if (confirmOtp) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        message: 'Invalid Otp',
      };
    } catch {}
  }

  async createLead({ firstName, lastName, email, password }: CreateUserDto) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const leadPayload = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const lead = await this.leadService.findLead({
      where: {
        email,
      },
    });

    let leadData;

    if (!lead.success) {
      leadData = await this.leadService.createLead(leadPayload);
    } else {
      leadData = await this.leadService.updateLead(
        lead.leadData.id,
        leadPayload,
      );
    }

    return leadData;
  }

  async filesUploaded(
    id: string,
    profileImage?: Express.Multer.File,
    coverImage?: Express.Multer.File,
  ) {
    console.log(id, 'one more time');

    let profileName;
    let coverName;
    if (profileImage) {
      const profileImageFile = {
        file: profileImage.buffer,
      };
      const key = uuidv4();
      profileName = `profile_image/${key}`;
      const filesUploadToS3 = await this.s3Service.uploadFileToS3(
        profileImageFile.file,
        profileName,
      );
    }

    if (coverImage) {
      const coverImageFile = {
        file: profileImage.buffer,
      };
      const key = uuidv4();
      coverName = `cover_image/${key}`;
      const filesUploadToS3 = await this.s3Service.uploadFileToS3(
        coverImageFile.file,
        coverName,
      );
      console.log(filesUploadToS3);
    }
    const body = {
      profileImage: profileName,
      coverImage: coverName,
    };

    const entry = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    console.log(entry.id);
    

    const data = await this.userRepository.update(entry.id, body);
    console.log(data);

    return {
      id: '',
      profileImage: '',
      coverImage: '',
    };
  }
}
