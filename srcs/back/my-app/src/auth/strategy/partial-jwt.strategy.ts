import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { TokenPayload, TokenType } from "../interfaces/token-payload.interface";

@Injectable()
export class PartialJwtStrategy extends PassportStrategy(
  Strategy,
  "partial-jwt",
) {
  private readonly logger = new Logger(PartialJwtStrategy.name);
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: "SECRET_KEY",
      ignoreExpiration: false,
	  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//      jwtFromRequest: ExtractJwt.fromExtractors([
//        (request: Request) => {
//          return request?.cookies?.Authentication;
//        },
//      ]),
    });
  }

  async validate(payload: TokenPayload) {
    // this.logger.log(`Validating partial JWT token for user ${payload.sub}`);
    const user = await this.authService.tokenValidateUser(payload);

    if (!user) {
      this.logger.log("Unauthorized access caught by PartialJwtStrategy");
      throw new UnauthorizedException({
        message: "PartialJWT: no user found in database with id ",
        id: payload.sub,
      });
    }
    return user;
  }
}
