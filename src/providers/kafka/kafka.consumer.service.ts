
import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from 'kafkajs';
import { Model } from 'mongoose';
import { Product } from 'src/user/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnApplicationShutdown {

  constructor(
    @InjectModel(User.name, 'change_stream_1') private UserModelDb1: Model<User>,
    @InjectModel(User.name, 'change_stream_2') private UserModelDb2: Model<User>,
    @InjectModel(Product.name, 'change_stream_1') private ProductModelDb1: Model<Product>,
    @InjectModel(Product.name, 'change_stream_2') private ProductModelDb2: Model<Product>,
  ) { }

  private readonly kafka = new Kafka({
    brokers: [process.env.KAFKA_URL],
  });

  private readonly consumers: Consumer[] = [];

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {

    const consumer = this.kafka.consumer({ groupId: 'group-1' });
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    this.consumers.push(consumer);

  }

  async onModuleInit() {

    await this.consume(
      {
        topics: ['create', 'delete', 'update'],
      },
      {
        eachMessage: async ({ topic, message }) => {
          const data = JSON.parse(message.value.toString());
          const sourceDb = data.dbName;
          const targetDb = sourceDb === 'change_stream_1' ? 'change_stream_2' : 'change_stream_1';

          const sourceCollection = data.collection;

          let targetCollection = null;

          if (sourceCollection === 'users') {
            targetCollection = (targetDb === 'change_stream_1') ? this.UserModelDb1 : this.UserModelDb2;
          } else if (sourceCollection === 'products') {
            targetCollection = (targetDb === 'change_stream_1') ? this.ProductModelDb1 : this.ProductModelDb2;
          }

          if (targetCollection) {
            switch (topic) {
              case 'create':
                const existingUser = await targetCollection.findById(data.document._id)
                if (!existingUser) {
                  await targetCollection.create(data.document);
                }
                break;

              case 'delete':
                await targetCollection.findByIdAndDelete(data.id);
                break;

              case 'update':
                await targetCollection.findByIdAndUpdate(data.id, data.changes);
                break;
            }

          } else {
            console.error(`Invalid target collection for ${topic}`);
          }
        },
      },
    );
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}


