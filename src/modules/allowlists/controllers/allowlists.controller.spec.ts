import { Test, TestingModule } from '@nestjs/testing';
import { AllowlistsController } from './allowlists.controller';

describe('AllowlistsController', () => {
  let controller: AllowlistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllowlistsController],
    }).compile();

    controller = module.get<AllowlistsController>(AllowlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
