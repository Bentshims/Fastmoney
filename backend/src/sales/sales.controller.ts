
import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { GetSalesFilterDto } from './dto/get-sales-filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() createSaleDto: CreateSaleDto) {
        // If employee is creating, attach their ID automatically if not present? 
        // Prompt says: "CreateSaleDto: employeeId?: string". 
        // Logic: if user is employee, use their ID. If Owner, maybe they can specify or null.
        // Let's assume frontend sends employeeId if user is employee or we extract from token if role != OWNER.
        // For now, consistent with DTO.
        return this.salesService.create(user.businessId, createSaleDto);
    }

    @Get()
    findAll(@CurrentUser() user: any, @Query() filterDto: GetSalesFilterDto) {
        return this.salesService.findAll(user.businessId, filterDto);
    }

    @Get(':id')
    findOne(@CurrentUser() user: any, @Param('id') id: string) {
        return this.salesService.findOne(user.businessId, id);
    }
}
