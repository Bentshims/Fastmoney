
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(['CAISSIER', 'GERANT'])
    role: 'CAISSIER' | 'GERANT';
}
