import { ChatRoom } from "src/chat_rooms/entities/chat_room.entity";
import { User } from "src/users/entities/user.entity";

export class CreateUserChatDto {
    userId: number;
    chatRoomId: number;
    userStatus: string;
    role: string;
    user: User;
    chatRoom: ChatRoom;
}
