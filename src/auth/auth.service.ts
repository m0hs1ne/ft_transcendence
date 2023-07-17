import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/User";
import { UserDetails } from "src/utils/types";
import { Repository } from "typeorm";


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository:
        Repository<User>,
    ){}

    async validateUser(details: UserDetails) {
        // console.log(details);
        const user = await this.userRepository.findOneBy({username: details.username})
        if (user) return user;
        // console.log('Creating new user...');
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser)
    }

    async findUser(id: number) {
        return await this.userRepository.findOneBy({id});
    }
}