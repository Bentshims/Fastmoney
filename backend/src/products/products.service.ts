
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(businessId: string, dto: CreateProductDto) {
        // Basic validation logic based on business type could go here if we fetched business first
        return this.prisma.product.create({
            data: {
                ...dto,
                businessId,
            }
        });
    }

    async findAll(businessId: string) {
        return this.prisma.product.findMany({
            where: { businessId }
        });
    }

    async findOne(businessId: string, id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, businessId }
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(businessId: string, id: string, dto: UpdateProductDto) {
        await this.findOne(businessId, id); // check exists
        return this.prisma.product.update({
            where: { id },
            data: dto
        });
    }

    async remove(businessId: string, id: string) {
        await this.findOne(businessId, id);
        return this.prisma.product.delete({ where: { id } });
    }

    async adjustStock(businessId: string, id: string, quantity: number, reason: string) {
        const product = await this.findOne(businessId, id);
        const newStock = product.stock + quantity;
        if (newStock < 0) throw new BadRequestException('Insufficient stock');

        return this.prisma.product.update({
            where: { id },
            data: { stock: newStock }
        });
    }
}
