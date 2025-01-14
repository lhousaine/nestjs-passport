import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { resolve } from 'path';
import { Response as ExpressResponse } from 'express';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/services/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Public } from './auth/utilities/decorators';
import { PassportRequest } from './auth/utilities/types';
import { SamlAuthGuard } from './auth/guards/saml-auth.guard';
import { UsersService } from './users/services/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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

  @Public()
  @Get('homepage')
  async homepage(@Response() res: ExpressResponse) {
    res.sendFile(resolve('./web/index.html'));
  }

  @Public()
  @Get('api/auth/sso/saml/login')
  @UseGuards(SamlAuthGuard)
  async samlLogin() {
    //this route is handled by passport-saml
    return;
  }

  @Post('api/auth/sso/saml/ac')
  @UseGuards(SamlAuthGuard)
  async samlAssertionConsumer(
    @Request() req: PassportRequest,
    @Response() res: ExpressResponse,
  ) {
    //this routes gets executed on successful assertion from IdP
    if (req.user) {
      const user = req.user;

      const jwt = this.authService.getTokenForUser(user);

      this.usersService.storeUser(user);

      res.redirect('/?jwt=' + jwt);
    }
  }
}
