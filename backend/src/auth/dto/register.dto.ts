import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    businessName: string;

    @IsEnum(['MAGASIN', 'PRESSING'])
    businessType: 'MAGASIN' | 'PRESSING';
}
