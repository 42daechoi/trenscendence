import { AuthModule } from "./../auth/auth.module";
import { TwoFactorAuthService } from "./twofactor-auth.service";
import { TwoFactorAuthController } from "./twofactor-auth.controller";
import { UsersModule } from "src/users/users.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService],
})
export class TwoFactorModule {}
