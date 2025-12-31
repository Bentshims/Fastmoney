
import { IsString, IsNumber, IsOptional, IsEnum, IsInt } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsInt()
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsEnum(['PRODUIT', 'ARTICLE_PRESSING'])
    type: 'PRODUIT' | 'ARTICLE_PRESSING';

    @IsString()
    @IsOptional()
    pressingType?: string;

    @IsInt()
    @IsOptional()
    processingTime?: number;
}
