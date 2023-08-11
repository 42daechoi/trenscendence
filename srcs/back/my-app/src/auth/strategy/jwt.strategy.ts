import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import {AuthService} from "../auth.service";
import { TokenPayload, TokenType } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private readonly authService : AuthService) {
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

  //return user after UseGuards(JwtAuthGuard)
  async validate(payload: TokenPayload) {
    // this.logger.log(`Validating JWT token for user ${payload.sub}`);
    // const user = await this.userService.findUserById(payload.sub);
    const user = await this.authService.tokenValidateUser(payload);

    if (!user) {
      this.logger.log("Unauthorized access caught by JwtStrategy");
      throw new UnauthorizedException({
        message: "JWT: no user found in database with id ",
        id: payload.id,
      });
    }
    // only validates if JWT token payload indicates full access
    if (payload.type === TokenType.FULL) {
      return user;
    }
  }
}
