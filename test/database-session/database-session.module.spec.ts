import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Connection } from "typeorm";
import { getConnectionToken } from "@nestjs/typeorm";
import { TestModule } from "./module/test.module";
import { ExampleModel } from "./module/example.model";

describe('DatabaseSessionModule', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    connection = moduleRef.get(getConnectionToken());
    await app.init();
    await clearExampleTable();
  });

  afterEach(async () => {
    await clearExampleTable();
  });

  const clearExampleTable = async () => {
    await connection.query("delete from example_model;")
    await connection.query("alter sequence example_model_id_seq restart 1")
  };

  it(`should commit transaction`, async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({ value: "test value" });

    const lastRow: ExampleModel = await connection
      .getRepository<ExampleModel>(ExampleModel)
      .findOne({ order: { id: "DESC" } });

    expect(response.status).toBe(201);
    expect(lastRow).toMatchObject({ id: 1, value: "test value" });
  });

  it(`should rollback transaction`, async () => {
    const result = await request(app.getHttpServer())
      .delete('/transactions')
      .send({ value: "test value" });

    const lastRow: ExampleModel[] = await connection
      .getRepository<ExampleModel>(ExampleModel)
      .find();

    expect(result.status).toBe(500);
    expect(lastRow.length).toBe(1);
    expect(lastRow[0]).toMatchObject({ id: 2, value: "rollback transaction" });
    expect(lastRow[1]).toBeUndefined();
  });
});
