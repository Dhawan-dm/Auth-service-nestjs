import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ImageUrlDto {
  @MinLength(2)
  @IsOptional()
  image_key: string;
}