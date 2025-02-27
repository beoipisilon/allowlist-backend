// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersDashboard } from '../../users/entities/users.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UsersDashboard),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve retornar o perfil do Discord com permissão "user" se o usuário não existir', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const discordProfile = { id: '123', username: 'test', avatar: 'avatar' };
    const result = await service.handleDiscordCallback(discordProfile);

    expect(result.permission).toBe('user');
  });
});