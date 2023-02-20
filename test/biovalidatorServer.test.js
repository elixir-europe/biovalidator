const fs = require("fs");
const npid = require("npid");

const BioValidatorServer = require('../src/core/server');
const supertest = require('supertest');
const server = new BioValidatorServer("3020", "");
server.start()
const requestWithSupertest = supertest(server.app);

describe('biovalidator server endpoints', () => {
  afterAll(done => {
    server.expressServer.close();
    npid.remove(server.pidPath);
    done();
  });

  it('GET /cache should initially return empty cache', async () => {
    const res = await requestWithSupertest.get('/cache');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('cachedSchema');
    expect(res.body).toEqual({"cachedSchema": [], "referencedSchema": []})
  });

  it('GET /cache contains object after one hit', async () => {

    let inputSchema = JSON.parse(fs.readFileSync("examples/schemas/biosamples-schema.json", "utf-8"));
    let inputData = JSON.parse(fs.readFileSync("examples/objects/faang-organism-sample.json", "utf-8"));

    let res = await requestWithSupertest.post('/validate')
        .send({
          "schema": inputSchema,
          "data": inputData
        });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual([])


    res = await requestWithSupertest.get('/cache');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('cachedSchema');
    expect(res.body).toEqual({"cachedSchema": ["test/biosamples/schema"], "referencedSchema": []})
  });

  it('GET /cache should be empty after cache clear', async () => {
    let res = await requestWithSupertest.delete('/cache');
    expect(res.status).toEqual(200);

    res = await requestWithSupertest.get('/cache');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('cachedSchema');
    expect(res.body).toEqual({"cachedSchema": [], "referencedSchema": []})
  });

});
