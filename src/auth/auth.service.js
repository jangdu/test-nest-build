"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_service_1 = require("../../config/jwt.config.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const nodemailer = require("nodemailer");
const users_service_1 = require("../user/users.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(cache, jwtConfigService, jwtService, usersService) {
        this.cache = cache;
        this.jwtConfigService = jwtConfigService;
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_EMAIL_PASSWORD,
            },
        });
    }
    async sendVerificationEmail(email) {
        const baseUrl = 'http://localhost:3000/user/emailTokenAuth';
        const emailToken = await this.generateEmailToken(email);
        const url = `${baseUrl}?emailToken=${emailToken}`;
        const mailOptions = {
            to: email,
            from: process.env.NODEMAILER_EMAIL,
            subject: '가입 인증 메일',
            html: `가입 확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
              <form action="${url}" method="POST">
              <button>가입확인</button>
            </form>`,
        };
        try {
            return await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('인증 정보 발송에 실패하였습니다. 메일 주소를 다시 확인해 주세요.');
        }
    }
    async verifyVerificationCode(emailToken) {
        const emailTokenOptions = this.jwtConfigService.createEmailJwtOptions();
        const secret = emailTokenOptions.secret;
        try {
            const verifiedEmailToken = await this.jwtService.verifyAsync(emailToken, {
                secret,
            });
            return verifiedEmailToken.email;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('인증이 유효하지 않습니다.');
        }
    }
    async generateEmailToken(email) {
        const payload = { email };
        const emailTokenOptions = this.jwtConfigService.createEmailJwtOptions();
        const emailToken = await this.jwtService.signAsync(payload, {
            secret: emailTokenOptions.secret,
            expiresIn: emailTokenOptions.signOptions.expiresIn,
        });
        return emailToken;
    }
    async generateAccessToken(userId, nickname) {
        const payload = { userId, nickname };
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken;
    }
    async generateRefreshToken(userId, nickname) {
        const payload = { userId, nickname };
        const refreshTokenOptions = this.jwtConfigService.createRefreshJwtOptions();
        console.log(refreshTokenOptions.secret);
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: refreshTokenOptions.secret,
            expiresIn: refreshTokenOptions.signOptions.expiresIn,
        });
        await this.cache.set('refreshToken:' + userId, refreshToken);
        return refreshToken;
    }
    async isRefreshTokenValid(refreshToken, userId) {
        try {
            const redisRefreshToken = await this.cache.store.get('refreshToken:' + userId);
            if (!this.isRefreshTokenExpired(redisRefreshToken))
                return false;
            if (refreshToken !== redisRefreshToken)
                return false;
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async isRefreshTokenExpired(refreshToken) {
        try {
            const refreshJwtOptions = this.jwtConfigService.createRefreshJwtOptions();
            const secret = refreshJwtOptions.secret;
            const verifiedRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
                secret,
            });
            return verifiedRefreshToken;
        }
        catch (error) {
            return false;
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [Object, jwt_config_service_1.JwtConfigService,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map