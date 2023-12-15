import { Module } from '@nestjs/common';
import { ChangeStreamService } from './change.stream.service';
import { KafkaModule } from '../kafka/kafka.module';


@Module({
    imports: [
        KafkaModule,
    ],
    providers: [ChangeStreamService],

})
export class ChangeStreamModule { }
