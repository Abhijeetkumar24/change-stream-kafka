
import { Injectable, OnModuleDestroy, OnApplicationBootstrap } from '@nestjs/common';
import { ChangeStreamDocument, ChangeStream } from 'mongodb';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { KafkaProducerService } from 'src/providers/kafka/kafka.producer.service';

@Injectable()
export class ChangeStreamService implements OnApplicationBootstrap, OnModuleDestroy {

    constructor(
        private readonly kafkaProducerService: KafkaProducerService,
        @InjectConnection('change_stream_1') private ConnectionOne: Connection,
        @InjectConnection('change_stream_2') private ConnectionTwo: Connection
    ) { }

    private changeStreamOne: ChangeStream;
    private changeStreamTwo: ChangeStream;

    async onApplicationBootstrap() {

        const dbOne = this.ConnectionOne.db;
        const dbTwo = this.ConnectionTwo.db;

        this.changeStreamOne = dbOne.watch();
        this.changeStreamTwo = dbTwo.watch();

        this.setupChangeStream(this.changeStreamOne);
        this.setupChangeStream(this.changeStreamTwo);
    }

    private setupChangeStream(changeStream: ChangeStream) {
        changeStream.on(
            'change',
            async (listener: ChangeStreamDocument<Document>) => {

                switch (listener.operationType) {
                    case 'insert':
                        await this.kafkaProducerService.produce({
                            topic: 'create',
                            messages: [
                                {
                                    value: JSON.stringify({
                                        dbName: listener.ns.db,
                                        collection: listener.ns.coll,
                                        document: listener.fullDocument,
                                    }),
                                },
                            ],
                        });
                        break;

                    case 'update':
                        await this.kafkaProducerService.produce({
                            topic: 'update',
                            messages: [
                                {
                                    value: JSON.stringify({
                                        dbName: listener.ns.db,
                                        collection: listener.ns.coll,
                                        id: listener.documentKey._id,
                                        changes: listener.updateDescription.updatedFields,
                                    }),
                                },
                            ],
                        });
                        break;

                    case 'delete':
                        await this.kafkaProducerService.produce({
                            topic: 'delete',
                            messages: [
                                {
                                    value: JSON.stringify({
                                        dbName: listener.ns.db,
                                        collection: listener.ns.coll,
                                        id: listener.documentKey._id,
                                    }),
                                },
                            ],
                        });
                        break;
                }
            },
        );
    }

    async onModuleDestroy() {
        this.changeStreamOne.close();
        this.changeStreamTwo.close();
    }
}


