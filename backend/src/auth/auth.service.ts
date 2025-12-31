
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Transaction to create User and Business
        const result = await this.prisma.$transaction(async (prisma) => {
            // 1. Create User first
            const user = await prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    role: 'OWNER',
                }
            });

            // 2. Create Business connected to Owner
            const business = await prisma.business.create({
                data: {
                    name: dto.businessName,
                    type: dto.businessType,
                    ownerId: user.id,
                }
            });

            // 3. Update User with businessId
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { businessId: business.id },
                include: { business: true }
            });

            return updatedUser;
        });

        const payload = { email: result.email, sub: result.id, businessId: result.businessId, role: result.role };
        return {
            accessToken: this.jwtService.sign(payload),
            user: result,
            business: result.business,
        };
    }

    async login(dto: LoginDto) {
        let entity: any = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { business: true },
        });

        // If not found in User, check Employee
        if (!entity) {
            entity = await this.prisma.employee.findUnique({
                where: { email: dto.email },
                include: { business: true },
            });
        }

        if (!entity) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(dto.password, entity.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: entity.email, sub: entity.id, businessId: entity.businessId, role: entity.role };
        return {
            accessToken: this.jwtService.sign(payload),
            user: entity,
            business: entity.business,
        };
    }
}
