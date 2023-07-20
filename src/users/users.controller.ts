import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseFilters, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserExistExceptionFilter } from 'src/exceptions/ExistException.filter';
import { userAuthGuard } from '../utils/guard'
import { UserNotExistExceptionFilter } from 'src/exceptions/NotExistException.filter';
import { AddFriendDto } from './dto/add-friend.dto';

@UseGuards(userAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (+id)
      return this.usersService.findOne(+id); 
  }

  @Patch(':id')
  @UseFilters(UserNotExistExceptionFilter)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() req) 
  {
    if (+id)
      return this.usersService.update(+id, updateUserDto,req);
  }

  @Delete(':id')
  @UseFilters(UserNotExistExceptionFilter)
  remove(@Param('id') id: string, @Req() req) {
    if (+id)
      return this.usersService.remove(+id, req);
  }

  //friends
  @Get('friends/:id')
  getFriends(@Param('id') id: string, @Req() req) {
    if (+id)
      return this.usersService.getfriends(+id);
  }

  @Post('friends')
  addFriends(@Body() addFriendDto: AddFriendDto,@Req() req)
  {
    return this.usersService.addfriends(addFriendDto, req)
  }
  @Delete('friends/:id')
  removeFriends(@Param('id') id: string, @Req() req)
  {
    return this.usersService.removefriends(+id, req);
  }

  //Blocked
  @Get('blocked/:id')
  getBlocked(@Param('id') id: string, @Req() req) {
    if (+id)
      return this.usersService.getblocked(+id);
  }

  @Post('blocked')
  addBlocked(@Body() addFriendDto: AddFriendDto,@Req() req)
  {
    return this.usersService.addblocked(addFriendDto, req)
  }
  @Delete('blocked/:id')
  removeBlocked(@Param('id') id: string, @Req() req)
  {
    return this.usersService.removeblocked(+id, req);
  }
}
