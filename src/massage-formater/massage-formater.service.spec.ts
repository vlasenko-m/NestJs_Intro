import { Test, TestingModule } from '@nestjs/testing';
import { MassageFormaterService } from './massage-formater.service';

describe('MassageFormaterService', () => {
  let service: MassageFormaterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MassageFormaterService],
    }).compile();

    service = module.get<MassageFormaterService>(MassageFormaterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
