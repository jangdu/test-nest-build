import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';
import { JwtConfigService } from '../../config/jwt.config.service';
import { Cache } from 'cache-manager';
import { UsersService } from 'src/user/users.service';
export declare class AuthService {
    private cache;
    private jwtConfigService;
    private jwtService;
    private usersService;
    private transporter;
    constructor(cache: Cache, jwtConfigService: JwtConfigService, jwtService: JwtService, usersService: UsersService);
    sendVerificationEmail(email: string): Promise<any>;
    verifyVerificationCode(emailToken: string): Promise<any>;
    generateEmailToken(email: string): Promise<string>;
    generateAccessToken(userId: number, nickname: string): Promise<string>;
    generateRefreshToken(userId: number, nickname: string): Promise<string>;
    isRefreshTokenValid(refreshToken: string, userId: number): Promise<boolean>;
    isRefreshTokenExpired(refreshToken: string): Promise<boolean | Payload>;
}
