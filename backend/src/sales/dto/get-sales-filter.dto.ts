import { IsOptional, IsIn } from 'class-validator';

export class GetSalesFilterDto {
    @IsOptional()
    @IsIn(['today', 'yesterday', 'last7days'])
    date?: 'today' | 'yesterday' | 'last7days';
}
