
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() createProductDto: CreateProductDto) {
        return this.productsService.create(user.businessId, createProductDto);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.productsService.findAll(user.businessId);
    }

    @Get(':id')
    findOne(@CurrentUser() user: any, @Param('id') id: string) {
        return this.productsService.findOne(user.businessId, id);
    }

    @Patch(':id')
    update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(user.businessId, id, updateProductDto);
    }

    @Delete(':id')
    remove(@CurrentUser() user: any, @Param('id') id: string) {
        return this.productsService.remove(user.businessId, id);
    }

    @Post(':id/adjust-stock')
    adjustStock(@CurrentUser() user: any, @Param('id') id: string, @Body('quantity') quantity: number, @Body('reason') reason: string) {
        return this.productsService.adjustStock(user.businessId, id, quantity, reason);
    }
}
