export class TransactionAlreadyStartedException extends Error {
  constructor() {
    super(
      'Transaction already started for the given connection, commit current transaction before starting a new one.',
    );
  }
}
