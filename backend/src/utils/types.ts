export type UserDetails = {
    tfSecret: string;
    mailOTP: string;
    mailOTPExpires: Date;
    email: string;
    username: string;
    avatar: string;
    level: number;
    wins: number;
    losses: number;
    statusOnline: boolean;
    inGame: boolean;
    is2fa: boolean;
    friends: any[];
    blocked: any[];
    createdAt: Date;
    updatedAt: Date;
};