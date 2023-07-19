import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/typeof";
import { UserDetails } from "src/utils/types";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository:
        Repository<User>,
        private readonly jwtService: JwtService,
    ){}

    async validateUser(details: UserDetails) {
        // console.log(details);
        const user = await this.userRepository.findOneBy({email: details.email})
        if (user) return user;
        // console.log('Creating new user...');
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser)
    }

    async findUser(id: number) {
        return await this.userRepository.findOneBy({id});
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }
}