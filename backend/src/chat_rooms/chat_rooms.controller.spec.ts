import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsController } from './chat_rooms.controller';

describe('ChatRoomsController', () => {
  let controller: ChatRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoomsController],
    }).compile();

    controller = module.get<ChatRoomsController>(ChatRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
