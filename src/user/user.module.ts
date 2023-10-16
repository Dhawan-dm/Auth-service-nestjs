import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OtpService } from 'src/user/otp.service';
import { Otp } from './entities/otp.entity';
import { Lead } from './entities/lead.entity';
import { LeadService } from './lead.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp, Lead])],
  controllers: [UserController],
  providers: [UserService, OtpService, LeadService],
})
export class UserModule {}
