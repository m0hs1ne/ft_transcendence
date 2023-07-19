import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserExistExceptionFilter, UserNotExistExceptionFilter } from 'src/exceptions/exception.filter';
import { userAuthGuard } from '../utils/guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(userAuthGuard)
  @UseFilters(UserExistExceptionFilter)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(userAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(userAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(userAuthGuard)
  @UseFilters(UserNotExistExceptionFilter)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(userAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
