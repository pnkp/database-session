import { TestModule } from "./test.module";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

describe('DatabaseSessionModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`should commit transaction`, async () => {
    const result = await request(app.getHttpServer())
      .post('/transactions')
      .send({ value: "test value" });

    expect(result.body).not.toBeNull();
  });

  it(`should rollback transaction`, async () => {
    const result = await request(app.getHttpServer())
      .delete('/transactions')
      .send({ value: "test value" });

    expect(result.status).toBe(500);
  });
});
