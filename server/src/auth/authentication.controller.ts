import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/public.decorator';
import { JwtGuard } from './guard/jwt.guard';

@Public()
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('login')
  @UseGuards(JwtGuard)
  async login(@Body() loginDto: LoginDto) {
    const validatedUser = await this.authenticationService.validateUser(loginDto.username, loginDto.password);

    if (validatedUser) {
      return this.authenticationService.login(validatedUser);
    } else {
      throw new BadRequestException('User not found');
    }
  }
}
