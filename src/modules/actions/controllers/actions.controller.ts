import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ActionsService } from '../services/actions.service';

@Controller('actions')
export class ActionsController {
    constructor(private readonly actionsService: ActionsService) {}

    @Post('log')
    async logUserAction(@Req() req: Request, @Res() res: Response) {
        const userId = req.session.user?.id; // Pega o user.id da sessão

        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const user = req.session.user; 
        const permission = 'admin'; 

        await this.actionsService.logAction(
          userId, 
          'atualizou a permissão do usuário ' + user.discordId + ' para ' + permission,
          user.discordId, 
        );

        return res.status(200).json({ message: 'Ação registrada com sucesso!' });
    }
}
