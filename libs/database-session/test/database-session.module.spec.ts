import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';
import {
  DatabaseSessionTestModule,
  SECOND_DATABASE_CONNECTION,
} from './module/database-session-test.module';
import { ExampleModel } from './module/example.model';

describe('DatabaseSessionModule', () => {
  let app: INestApplication;
  let connection: Connection;
  let connectionSecondDatabase: Connection;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseSessionTestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    connection = app.get(getConnectionToken());
    connectionSecondDatabase = app.get(
      getConnectionToken(SECOND_DATABASE_CONNECTION),
    );
    await app.init();
    await clearExampleTable(connection);
    await clearExampleTable(connectionSecondDatabase);
  });

  afterEach(async () => {
    await clearExampleTable(connection);
    await clearExampleTable(connectionSecondDatabase);
  });

  const clearExampleTable = async (connection: Connection) => {
    await connection.query('delete from example_model;');
    await connection.query('alter sequence example_model_id_seq restart 1');
  };

  const getLastRow = async (connection: Connection): Promise<ExampleModel> => {
    return await connection
      .getRepository<ExampleModel>(ExampleModel)
      .findOne({ order: { id: 'DESC' } });
  };

  const getRows = async (connection: Connection): Promise<ExampleModel[]> => {
    return await connection.getRepository<ExampleModel>(ExampleModel).find();
  };

  describe('one database session', () => {
    it(`should commit transaction`, async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send({ value: 'test value' });

      const lastRow: ExampleModel = await getLastRow(connection);

      expect(response.status).toBe(201);
      expect(lastRow).toMatchObject({ id: 1, value: 'test value' });
    });

    it(`should rollback transaction`, async () => {
      const result = await request(app.getHttpServer())
        .delete('/transactions')
        .send({ value: 'test value' });

      const rows: ExampleModel[] = await getRows(connection);

      expect(result.status).toBe(500);
      expect(rows.length).toBe(1);
      expect(rows[0]).toMatchObject({
        id: 2,
        value: 'rollback transaction',
      });
      expect(rows[1]).toBeUndefined();
    });
  });

  describe('two database sessions', () => {
    it(`should commit transaction`, async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions/second-database')
        .send({ value: 'second-database' });

      const lastRow: ExampleModel = await getLastRow(connectionSecondDatabase);

      expect(response.status).toBe(201);
      expect(lastRow).toMatchObject({ id: 1, value: 'second-database' });
    });

    it(`should rollback transaction`, async () => {
      const result = await request(app.getHttpServer())
        .delete('/transactions/second-database')
        .send({ value: 'second-database' });

      const rows: ExampleModel[] = await getRows(connectionSecondDatabase);

      expect(result.status).toBe(500);
      expect(rows.length).toBe(1);
      expect(rows[0]).toMatchObject({
        id: 2,
        value: 'rollback transaction in second database',
      });
      expect(rows[1]).toBeUndefined();
    });
  });

  describe('combine of two database transaction', () => {
    it('should commit database transaction in default database connection and rollback transaction in second database', async () => {
      await request(app.getHttpServer())
        .post('/transactions/combine')
        .send({ value: 'default database' });

      const lastRowFromSecondDatabase: ExampleModel = await getLastRow(
        connectionSecondDatabase,
      );
      const lastRowFromDefaultDatabase: ExampleModel = await getLastRow(
        connection,
      );

      expect(lastRowFromSecondDatabase).toMatchObject({
        id: 2,
        value: 'rollback transaction in second database',
      });
      expect(lastRowFromDefaultDatabase).toMatchObject({
        id: 1,
        value: 'default database',
      });
    });
  });
});
