import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseFilters, UseGuards, Req, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserExistExceptionFilter } from 'src/exceptions/ExistException.filter';
import { userAuthGuard, verifyToken } from '../utils/guard'
import { UserNotExistExceptionFilter } from 'src/exceptions/NotExistException.filter';
import { AddFriendDto } from './dto/add-friend.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { diskStorage } from 'multer';

@UseGuards(userAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('myprofile')
  findProfile(@Req() req) {
    const payload = verifyToken(req.headers.cookie)
    return this.usersService.profile(payload.sub);
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
  @Get('friends')
  getFriends(@Req() req) {
    const payload = verifyToken(req.headers.cookie)
    return this.usersService.getfriends(payload.sub);
  }

  @Post('friends')
  addFriends(@Body() addFriendDto: AddFriendDto,@Req() req)
  {
    return this.usersService.addfriends(addFriendDto, req)
  }
  @Delete('friends/:id')
  removeFriends(@Param('id') id: number, @Req() req)
  {
    return this.usersService.removefriends(+id, req);
  }

  //Blocked
  @Get('blocked')
  getBlocked(@Req() req) {
    const payload = verifyToken(req.headers.cookie)
    return this.usersService.getblocked(payload.sub);
  }

  @Post('blocked')
  addBlocked(@Body() addFriendDto: AddFriendDto,@Req() req)
  {
    //expected: id: user to block
    return this.usersService.addblocked(addFriendDto, req)
  }

  @Delete('blocked/:id')
  removeBlocked(@Param('id') id: string, @Req() req)
  {
    return this.usersService.removeblocked(+id, req);
  }

  @Post('upload_avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'public/img',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }))
  uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
    ],
  }),) file: Express.Multer.File, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    this.usersService.uploadAvatar(file, payload)
    return {
      statusCode: 200,
      data: file.path,
    };;
  }
}
