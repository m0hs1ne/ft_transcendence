import { PartialType } from '@nestjs/mapped-types';
import { CreateUserChatDto } from './create-user_chat.dto';

export class UpdateUserChatDto extends PartialType(CreateUserChatDto) {}
