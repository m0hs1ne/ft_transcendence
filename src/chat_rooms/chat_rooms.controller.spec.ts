import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsController } from './chat_rooms.controller';
import { ChatRoomsService } from './chat_rooms.service';

describe('ChatRoomsController', () => {
  let controller: ChatRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoomsController],
      providers: [ChatRoomsService],
    }).compile();

    controller = module.get<ChatRoomsController>(ChatRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
