import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  @IsNotEmpty()
  firstName: string;

  @MinLength(2)
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}
