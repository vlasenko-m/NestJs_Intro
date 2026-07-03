import { Injectable } from '@nestjs/common';
import { MassageFormaterService } from 'src/massage-formater/massage-formater.service';

@Injectable()
export class LoggerService {
    constructor(private readonly massageFormaterService: MassageFormaterService) {}

    log(massage: string): void {
        const formattedMassage = this.massageFormaterService.format(massage);
        console.log(formattedMassage);
    }
}
