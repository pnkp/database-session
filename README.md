# About package
This package able to manager easily way to database transaction, now you can start and commit transaction wherever you are.  
_**WARNING: Package running in REQUEST SCOPE**_
 
## Installation
```bash
npm install --save @antyper/database-session typeorm @nestjs/common rxjs 
# you have to install a database driver for e.g:
npm install --save pg
```

## Configuration

```typescript
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
export class AppModule {}
```

## Use case
```typescript
@Injectable()
export class ExampleRepository {
  private databaseSession: DatabaseSession;
  constructor(
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {
    this.databaseSession = this.databaseSessionManager.getDatabaseSession();
  }

  async save(exampleModel: Partial<ExampleModel>): Promise<ExampleModel> {
    const repository = this.databaseSession.getRepository(ExampleModel);
    return await repository.save(exampleModel);
  }
}

@Controller('transactions')
export class TransactionController {
  private readonly databaseSession: DatabaseSession;
  constructor(
    private readonly exampleRepository: ExampleRepository,
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: DatabaseSessionManager,
  ) {
    this.databaseSession = this.databaseSessionManager.getDatabaseSession();
  }

  @Post()
  async commitTransaction(
    @Body() data: { value: string },
  ): Promise<ExampleModel> {
    try {
      // starting transacrtion
      await this.databaseSession.transactionStart();
      const result = await this.exampleRepository.save(data);
      
      // commiting transaction 
      await this.databaseSession.transactionCommit();
      return result;
    } catch (e) {
      
      // rollback transaction
      await this.databaseSession.transactionRollback();
      throw e;
    }
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
