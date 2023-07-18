export class CreateUserDto {
    id: number;
    email: string;
    username: string;
    avatar: string;
    is2fa: boolean;
    wins: number;
    loses: number;
    level: number;
    statusOnline: boolean;
    inGame: boolean;
}
