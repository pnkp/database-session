import { TestModule } from "./test.module";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Connection } from "typeorm";
import { getConnectionToken } from "@nestjs/typeorm";
import { ExampleModel } from "./example.model";

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
  });

  afterEach(async () => {
    await connection.query("delete from example_model;")
    await connection.query("alter sequence example_model_id_seq restart 1")
  })

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

    expect(result.status).toBe(204);
  });
});
