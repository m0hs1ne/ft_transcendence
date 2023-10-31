import { Test, TestingModule } from '@nestjs/testing';
import { UserChatService } from './user_chat.service';

describe('UserChatService', () => {
  let service: UserChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserChatService],
    }).compile();

    service = module.get<UserChatService>(UserChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
