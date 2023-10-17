import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoginRequestDTO {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}
