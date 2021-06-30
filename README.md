## Installation
```bash
npm install --save @antyper/database-session typeorm @nestjs/common rxjs 
# you have to install a database driver for e.g:
npm install --save pg
```

## Configuration

```typescript
// main.ts
import { 
  DatabaseSessionInitializer,
  TransactionMiddleware,
  DATABASE_SESSION_INITIALIZER,
} from '@antyper/database-session';

async function bootstrap() {
  // ...
  const databaseSessionInitializer = app.get<DatabaseSessionInitializer>(
    DATABASE_SESSION_INITIALIZER,
  );
  app.use(TransactionMiddleware(databaseSessionInitializer));
  // ..
}
bootstrap();
```

```typescript
// app.module.ts
import { DatabaseSessionModule } from '@antyper/database-session';

@Module({
  providers: [],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      synchronize: true,
      entities: [ExampleModel],
    }),
    DatabaseSessionModule.forRoot(),
  ],
  controllers: [],
})
export class AppModule {
}
```

## Use case
```typescript
// example.repository.ts
import { 
  Transaction,
  InjectDatabaseSessionManager,
  DatabaseSessionManager,
} from "@antyper/database-session"

@Injectable()
export class ExampleRepository {
  private databaseSession: DatabaseSession;
  constructor(
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {
    this.databaseSession = this.databaseSessionManager.getDatabaseSession("databaseConnectionName");
  }

  async save(exampleModel: Partial<ExampleModel>): Promise<ExampleModel> {
    const repository = this.databaseSession.getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}

// transaction.controller.ts
import { Transaction } from "@antyper/database-session"

@Controller('transactions')
export class TransactionController {
  private readonly databaseSession: DatabaseSession;
  constructor(
    private readonly exampleRepository: ExampleRepository,
  ) {}

  @Transaction("databaseConnectionName")
  @Post()
  async commitTransaction(
    @Body() data: { value: string },
  ): Promise<ExampleModel> {
    return await this.exampleRepository.save(data);
  }
}
```

```typescript
// getting DatabaseSession for "default" connection
const databaseSession = this.databaseSessionManager.getDatabaseSession();

const connectionName = "secondDatabaseConnectionName";
const databaseSessionSecondDatabase = this.databaseSessionManager.getDatabaseSession(
  connectionName,
);
```
