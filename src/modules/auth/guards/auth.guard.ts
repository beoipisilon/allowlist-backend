import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Logger } from '@nestjs/common';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
  private readonly logger = new Logger(DiscordAuthGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Verifica se o usuário já está autenticado na sessão
    if (request.session.isAuthenticated) {
      this.logger.log(`Usuário autenticado: ${JSON.stringify(request.user)}`);
      return true;
    }

    // Caso contrário, prossegue com a autenticação via Discord
    return super.canActivate(context) as boolean;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      this.logger.error(`Falha na autenticação: ${err?.message || 'Usuário não encontrado'}`);
      throw new UnauthorizedException('Falha na autenticação via Discord');
    }

    // Adiciona o usuário à sessão
    const request = context.switchToHttp().getRequest<Request>();
    request.session.user = user;
    request.session.isAuthenticated = true;

    this.logger.log(`Usuário autenticado com sucesso: ${JSON.stringify(user)}`);
    return user;
  }
}