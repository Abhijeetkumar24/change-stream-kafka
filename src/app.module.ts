import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { KafkaModule } from './providers/kafka/kafka.module';
import { ChangeStreamModule } from './providers/changeStream/change.stream.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGO_STREAM_1, {
      connectionName: 'change_stream_1'
    }
    ),

    MongooseModule.forRoot(
      process.env.MONGO_STREAM_2, {
      connectionName: 'change_stream_2'
    }
    ),

    UserModule,

    KafkaModule,

    ChangeStreamModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
