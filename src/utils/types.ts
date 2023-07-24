export type UserDetails = {
    tfSecret: string;
    email: string;
    username: string;
    mailOTP: string;
    mailOTPExpires: Date;
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