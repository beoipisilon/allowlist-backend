export class BotSettingsDto {
  name: string;
  avatar: string;
  status: string;
  activity: {
    type: string;
    name: string;
  } | null;
  description: string;
} 