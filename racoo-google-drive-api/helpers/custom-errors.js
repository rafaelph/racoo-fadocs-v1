class InternalError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InternalError';
      Error.captureStackTrace(this, InternalError);
    }
}

class RecordNotFound extends Error {
    constructor(message) {
      super(message);
      this.name = 'RecordNotFound';
      Error.captureStackTrace(this, RecordNotFound);
    }
}