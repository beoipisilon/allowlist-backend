import { Test, TestingModule } from '@nestjs/testing';
import { AllowlistsService } from './allowlists.service';

describe('AllowlistsService', () => {
  let service: AllowlistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllowlistsService],
    }).compile();

    service = module.get<AllowlistsService>(AllowlistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
