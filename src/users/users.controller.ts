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
import { MessageBody } from '@nestjs/websockets';

@UseGuards(userAuthGuard)
@Controller('users/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  findProfile(@Req() req) {
    const payload = verifyToken(req.headers.cookie)
    return this.usersService.myprofile(payload.sub);
  }

  @Get('profile/:id')
  findOtherProfile(@Param('id') id, @Req() req) {
    if (typeof id != 'number')
      return;
    const payload = verifyToken(req.headers.cookie)
    return this.usersService.profile(id, payload);
  }

  @Patch('profile/update')
  async update(@MessageBody() body,@Req() req) 
  {
    const {
      username
    } = body;
    if (typeof username != 'string')
      return;
    const payload = verifyToken(req.headers.cookie);
    return await this.usersService.update(payload.sub, username);
  }

  //friends
  @Get('friends')
  getFriends(@Req() req) {
    const payload = verifyToken(req.headers.cookie)
    return this.usersService.getfriends(payload.sub);
  }

  @Post('friends')
  addFriends(@MessageBody() body,@Req() req)
  {
    const {
      id
    } = body
    if (typeof id === 'number')
      return this.usersService.addfriends(id, req)
  }

  @Delete('friends/:id')
  removeFriends(@Param('id') id, @Req() req)
  {
    if (typeof id === 'number')
      return this.usersService.removefriends(+id, req);
  }

  //Blocked
  @Get('blocked')
  getBlocked(@Req() req) {
    const payload = verifyToken(req.headers.cookie)
    return this.usersService.getblocked(payload.sub);
  }

  @Post('blocked')
  addBlocked(@MessageBody() body,@Req() req)
  {
    //expected: id: user to block
    const {
      id
    } = body
    if (typeof id === 'number')
      return this.usersService.addblocked(id, req)
  }

  @Delete('blocked/:id')
  removeBlocked(@Param('id') id, @Req() req)
  {
    if (typeof id === 'number')
      return this.usersService.removeblocked(id, req);
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
    };
  }
}
