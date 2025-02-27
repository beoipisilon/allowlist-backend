import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now(); // Tempo inicial da requisição

        const { method, originalUrl, body, query, params } = req;

        // Registra informações da requisição
       //console.log('Requisição recebida:', {
       //    timestamp: new Date().toISOString(),
       //    method,
       //    url: originalUrl,
       //    body,
       //    query,
       //    params,
       //});

        // Monitora o tempo de execução e o status da resposta
        res.on('finish', () => {
        const duration = Date.now() - start; // Tempo total da requisição
       // console.log('Resposta enviada:', {
       //     timestamp: new Date().toISOString(),
       //     status: res.statusCode,
       //     duration: `${duration}ms`,
       // });
        });

        // Chama a próxima função no ciclo de requisição-resposta
        next();
    }
}