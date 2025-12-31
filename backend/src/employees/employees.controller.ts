
import { Controller, Get, Post, Body, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() createEmployeeDto: CreateEmployeeDto) {
        if (user.role !== 'OWNER') {
            throw new ForbiddenException('Only owners can create employees');
        }
        return this.employeesService.create(user.businessId, createEmployeeDto);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.employeesService.findAll(user.businessId);
    }

    @Delete(':id')
    remove(@CurrentUser() user: any, @Param('id') id: string) {
        if (user.role !== 'OWNER') {
            throw new ForbiddenException('Only owners can delete employees');
        }
        return this.employeesService.remove(user.businessId, id);
    }
}
