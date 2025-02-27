import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error | null, user: any) => void): void {
        console.log('Serializando usuário:', user);
        done(null, user); // Salva o usuário completo na sessão
    }

    deserializeUser(payload: any, done: (err: Error | null, payload: any) => void): void {
        console.log('Deserializando usuário:', payload);
        done(null, payload); // Recupera o usuário da sessão
    }
}