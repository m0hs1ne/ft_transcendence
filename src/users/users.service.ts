import { Injectable, Options, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto)
    newUser.inGame = false;
    newUser.statusOnline = false;
    newUser.wins = 0;
    newUser.loses = 0;
    newUser.is2fa = false;
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id : id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.findOneBy({id})
    this.userRepository.update({id}, {
      username: updateUserDto.username,
      avatar: updateUserDto.avatar,
      is2fa: updateUserDto.is2fa
    })
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    this.userRepository.delete({id})
    return `This action removes a #${id} user`;
  }
}
