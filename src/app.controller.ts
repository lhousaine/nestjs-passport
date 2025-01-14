import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/services/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Public } from './auth/utilities/decorators';
import { PassportRequest } from './auth/utilities/types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: PassportRequest) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req: PassportRequest) {
    return req.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: PassportRequest) {
    return req.user;
  }

  @Public()
  @Get('pub')
  findAll() {
    return [];
  }
}
