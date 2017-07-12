/* eslint-env jest */

const { role } = require('../lib');
const {
  seedDatabase,
  dropDatabase,
  generateDatabaseName,
  generateRandomString,
  ConnectionFactory,
} = require('./setup-database');

describe('deleteRole()', () => {
  const database = generateDatabaseName();
  let conn;

  beforeAll(seedDatabase(database));
  afterAll(dropDatabase(database));

  beforeEach(() => {
    conn = ConnectionFactory();
  });

  it('should return NOT_FOUND trying to delete a non-existent role.', () =>
    role.delete(conn, 'no-writer').then(res => {
      expect(res.status).toEqual(404);
    }));

  it("should delete a 'writer' role recently created.", () => {
    const rolename = generateRandomString();
    return role
      .create(conn, { name: rolename })
      .then(res => {
        expect(res.status).toBe(201);
        return role.delete(conn, rolename);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
  });
});