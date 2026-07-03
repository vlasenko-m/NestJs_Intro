import { Injectable } from '@nestjs/common';

@Injectable()
export class MassageFormaterService {
    format(message: string): string {
        const date = new Date();
        return `[${date.toISOString()}] ${message}`;
    }
}
