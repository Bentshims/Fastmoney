
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'supersecret',
        });
    }

    async validate(payload: any) {
        if (!payload.sub) {
            throw new UnauthorizedException();
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { business: true },
        });
        // Check if it's an employee if user not found (though prompt 2 implies employees are in separate table, prompt 1 schema puts users in User. let's check prompt 2 schema again.
        // Prompt 2 says: "Un employee se connecte via /auth/login aussi (même table User possible si tu préfères, mais pour la V1 sépare Employee de User)."
        // So we need to check Employee table too if User not found.

        if (user) return user;

        const employee = await this.prisma.employee.findUnique({
            where: { id: payload.sub },
            include: { business: true },
        });

        if (employee) return employee;

        throw new UnauthorizedException();
    }
}
