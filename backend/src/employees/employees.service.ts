
import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
    constructor(private prisma: PrismaService) { }

    async create(businessId: string, dto: CreateEmployeeDto) {
        const existing = await this.prisma.employee.findUnique({
            where: { email: dto.email }
        });
        if (existing) throw new ConflictException('Email already exists');

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.prisma.employee.create({
            data: {
                ...dto,
                password: hashedPassword,
                businessId
            }
        });
    }

    async findAll(businessId: string) {
        return this.prisma.employee.findMany({
            where: { businessId }
        });
    }

    async remove(businessId: string, id: string) {
        const employee = await this.prisma.employee.findUnique({ where: { id } });
        if (!employee || employee.businessId !== businessId) {
            throw new NotFoundException('Employee not found');
        }
        return this.prisma.employee.delete({ where: { id } });
    }
}
