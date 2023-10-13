import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsService } from './chat_rooms.service';

describe('ChatRoomsService', () => {
  let service: ChatRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoomsService],
    }).compile();

    service = module.get<ChatRoomsService>(ChatRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
