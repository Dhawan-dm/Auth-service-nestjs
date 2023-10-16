import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

}
