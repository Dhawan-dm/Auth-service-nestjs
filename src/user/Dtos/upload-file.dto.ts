import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UploadFileDto {
  @MinLength(2)
  @IsOptional()
  id: string;
}