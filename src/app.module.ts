import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyRequestModule } from './policy-request/policy-request.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    //Import modules to policy request and login
    PolicyRequestModule,
    AuthModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //Configuration to connect to DB
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',

        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT'), 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        options: {
          encrypt: config.get<string>('DB_ENCRYPT') === 'true',
          trustServerCertificate: true,
        },

        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
