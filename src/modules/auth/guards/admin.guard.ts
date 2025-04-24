import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const session = request.session;
        
       // console.log('AdminGuard - Session:', session);
        //console.log('AdminGuard - User:', session?.user);
        console.log('AdminGuard - User Permission:', session?.user?.permission);
        
        const isAdmin = session && session.user && session.user.permission === 'administrador';
        console.log('AdminGuard - Is Admin:', isAdmin);
        
        return isAdmin;
    }
}