
import { ValidateNested, IsString, IsNumber, IsEnum, IsOptional, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;
}

export class CreateSaleDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => SaleItemDto)
    items: SaleItemDto[];

    @IsEnum(['CASH', 'MOBILE_MONEY', 'CARTE', 'CREDIT'])
    paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARTE' | 'CREDIT';

    @IsString()
    @IsOptional()
    employeeId?: string;
}
