import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsGateway } from './chat_rooms.gateway';
import { ChatRoomsService } from './chat_rooms.service';

describe('ChatRoomsGateway', () => {
  let gateway: ChatRoomsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoomsGateway, ChatRoomsService],
    }).compile();

    gateway = module.get<ChatRoomsGateway>(ChatRoomsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
