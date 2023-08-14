import { UsersService } from "src/users/users.service";
import { User } from "src/typeorm";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { authenticator } from "otplib";
import { toDataURL, toFileStream } from "qrcode";
import { Response } from "express";

@Injectable()
export class TwoFactorAuthService {
  private readonly logger = new Logger(TwoFactorAuthService.name);
  constructor(private readonly userService: UsersService) {}

  async generateTwoFactorAuthSecret(user: User) {
    this.logger.log(`Generating 2FA secret for user ${user.id}`);
	//generate secret key
    const secret = authenticator.generateSecret();

	//get APP name
//    const appName = process.env.TWOFA_APP_NAME ?? "Pong";
	const appName = "tr42";

	//generate otpauthUrl
    const otpauthUrl = authenticator.keyuri(user.intraId, appName, secret);

    await this.userService.update(user.id, {twoFASecret: secret});
    return otpauthUrl;
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async getQrCodeAsDataUrl(otpauthUrl: string) {
    return await toDataURL(otpauthUrl);
  }

  isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
    if (!user.twoFASecret || user.twoFASecret.length < 1) {
      throw new BadRequestException("2FA: user has not registered a secret");
    }
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFASecret,
    });
  }

  async enableTwoFactor(user: User) {
    await this.userService.update(user.id, { ...user, twoFA: true });
  }

  async disableTwoFactor(user: User) {
    await this.userService.update(user.id, {
      ...user,
      twoFA: false,
      twoFASecret: "",
    });
  }
}
