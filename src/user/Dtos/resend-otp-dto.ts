import { IsEmail, IsIn, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class ResendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
