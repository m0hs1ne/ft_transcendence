import { PartialType } from '@nestjs/mapped-types';
import { CreateChatRoomDto } from './create-chat_room.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {
    chatId: number;
    title: string;
    privacy: string;
    ifProtectedPass: string;
}
