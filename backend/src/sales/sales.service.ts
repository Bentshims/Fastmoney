
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { GetSalesFilterDto } from './dto/get-sales-filter.dto';

@Injectable()
export class SalesService {
    constructor(private prisma: PrismaService) { }

    async create(businessId: string, dto: CreateSaleDto) {
        // 1. Validate all products belong to business and have stock
        const productIds = dto.items.map(i => i.productId);
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                businessId
            }
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException('Some products not found or do not belong to your business');
        }

        // Check stock & Calculate total
        let totalAmount = 0;
        for (const item of dto.items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                // Should ideally rely on previous length check, but typescript needs assurance
                throw new BadRequestException(`Product not found: ${item.productId}`);
            }
            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product ${product.name}`);
            }
            totalAmount += product.price * item.quantity;
        }

        // 2. Fetch business to check type for ticket generation
        const business = await this.prisma.business.findUnique({ where: { id: businessId } });
        let ticketCode: string | null = null;
        if (business?.type === 'PRESSING') {
            ticketCode = 'PR-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        }

        // 3. Transaction: Create Sale, SaleItems, Update Stocks
        return this.prisma.$transaction(async (prisma) => {
            // Update stocks
            for (const item of dto.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // Create Sale
            return prisma.sale.create({
                data: {
                    totalAmount,
                    paymentMethod: dto.paymentMethod,
                    ticketCode,
                    businessId,
                    employeeId: dto.employeeId,
                    items: {
                        create: dto.items.map(item => ({
                            quantity: item.quantity,
                            unitPrice: products.find(p => p.id === item.productId)?.price || 0,
                            productId: item.productId
                        }))
                    }
                },
                include: { items: true }
            });
        });
    }

    async findAll(businessId: string, filterDto: GetSalesFilterDto) {
        const { date } = filterDto;
        let whereClause: any = { businessId };

        if (date) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const last7Days = new Date(today);
            last7Days.setDate(last7Days.getDate() - 7);

            if (date === 'today') {
                whereClause.createdAt = { gte: today };
            } else if (date === 'yesterday') {
                whereClause.createdAt = { gte: yesterday, lt: today };
            } else if (date === 'last7days') {
                whereClause.createdAt = { gte: last7Days };
            }
        }

        return this.prisma.sale.findMany({
            where: whereClause,
            include: { items: { include: { product: true } } }, // Include details
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(businessId: string, id: string) {
        const sale = await this.prisma.sale.findFirst({
            where: { id, businessId },
            include: { items: { include: { product: true } }, employee: true }
        });
        if (!sale) throw new NotFoundException('Sale not found');
        return sale;
    }
}
