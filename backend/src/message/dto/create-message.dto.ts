import { ChatRoom } from "src/chat_rooms/entities/chat_room.entity";
import { User } from "src/users/entities/user.entity";

export class CreateMessageDto {
    message: string;
    userId: number;
    chatroomId: number;
}
