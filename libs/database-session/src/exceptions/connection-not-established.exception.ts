export class ConnectionNotEstablishedException extends Error {
  constructor() {
    super('You should have at least one database connection');
  }
}
