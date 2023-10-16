import { Module } from '@nestjs/common';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
