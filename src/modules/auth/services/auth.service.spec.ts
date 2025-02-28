import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DiscordService } from '../../discord/services/discord.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockDiscordService: Partial<DiscordService>;

  beforeEach(async () => {
    mockDiscordService = {
      getUsername: jest.fn().mockResolvedValue('test'),
      getAvatarUrl: jest.fn().mockResolvedValue('avatar'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DiscordService, useValue: mockDiscordService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve retornar o perfil do Discord com permissão "user"', async () => {
    const discordProfile = { id: '123', username: 'test', avatar: 'avatar' };
    const result = await service.handleDiscordCallback(discordProfile);

    expect(result).toEqual({
      discordId: '123',
      username: 'test',
      avatarUrl: 'avatar',
      permission: 'user', 
    });
  });
});