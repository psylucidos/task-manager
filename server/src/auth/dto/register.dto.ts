import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Username may contain only letters and numbers.',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must have at least 6 characters.' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;
}
