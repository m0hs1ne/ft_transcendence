export class CreateUserDto {
    email: string;
    username: string;
    avatar: string;
    is2fa: boolean;
    wins: number;
    losses: number;
    level: number;
    statusOnline: boolean;
    inGame: boolean;
}
