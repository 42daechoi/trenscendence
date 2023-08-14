import { TwoFactorAuthCodeDto } from "./dtos/twofactor-auth-code.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { TwoFactorAuthService } from "./twofactor-auth.service";
import { User } from "src/typeorm";
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Logger,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/guards/auth-jwt.guard";
import PartialJwtGuard from "src/auth/guards/auth-partial-jwt.guard";
import {TokenType} from "src/auth/interfaces/token-payload.interface";


@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  private readonly logger = new Logger(TwoFactorAuthController.name);
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  @UseGuards(JwtAuthGuard)
  async register(
    @Res() response: Response,
    @CurrentUser() user: User,
  ): Promise<string | void> {
    const otpauthUrl =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);
    const qrCode = await this.twoFactorAuthService.getQrCodeAsDataUrl(
      otpauthUrl,
    );
    response.send(qrCode);
  }

  @Post("enable")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async enableTwoFactorAuth(
    @CurrentUser() user: User,
    @Body() twoFactorAuthCode: TwoFactorAuthCodeDto,
  ) {
    this.validateCode(user, twoFactorAuthCode.twoFactorAuthCode);
    await this.twoFactorAuthService.enableTwoFactor(user);
    this.logger.log(`2FA has been enabled for user ${user.id}`);
  }

  @Post("disable")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async disableTwoFactorAuth(@CurrentUser() user: User) {
    await this.twoFactorAuthService.disableTwoFactor(user);
    this.logger.log(`2FA has been disabled for user ${user.id}`);
  }

  @Post("authenticate")
  @HttpCode(200)
  @UseGuards(PartialJwtGuard)
  async authenticate(
    @CurrentUser() user: User,
    @Body() twoFactorAuthCode: TwoFactorAuthCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.validateCode(user, twoFactorAuthCode.twoFactorAuthCode);

	//give TokenPayload and getJwtToken
	const full_token = await this.authService.validateUser(user.intraId, TokenType.FULL)
	//bake cookie with FULL Token
	this.authService.setJwtCookie(res, full_token.accessToken);
//    res.setHeader("Set-Cookie", authCookie);
	return res.redirect('http://localhost:3000/main');
  }

  private validateCode(user: User, twoFactorAuthCode: string) {
    this.logger.log(
      `Attempting to validate user ${user.id} with 2FA code ${twoFactorAuthCode}`,
    );
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      user,
    );
    if (!isCodeValid) {
      console.log("2FA code not valid");
      throw new UnauthorizedException("2FA: wrong authentication code");
    }
  }
}
