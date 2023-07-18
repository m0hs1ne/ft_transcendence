import { Test, TestingModule } from '@nestjs/testing';
import { UserChatController } from './user_chat.controller';
import { UserChatService } from './user_chat.service';

describe('UserChatController', () => {
  let controller: UserChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserChatController],
      providers: [UserChatService],
    }).compile();

    controller = module.get<UserChatController>(UserChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
