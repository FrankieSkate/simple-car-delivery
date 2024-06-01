export class CUSTOMER_ERROR extends Error {
  constructor(...args) {
    super(...args);
    this.name = "CUSTOMER_ERROR";
  }
}

export class ERROR_ON_SUBMIT extends Error {
  constructor(...args) {
    super(...args);
    this.name = "ERROR_ON_SUBMIT";
  }
}

export class ERROR_ON_GET extends Error {
  constructor(...args) {
    super(...args);
    this.name = "ERROR_ON_GET";
  }
}

export class ERROR_ON_FETCH extends Error {
  constructor(...args) {
    super(...args);
    this.name = "ERROR_ON_FETCH";
  }
}
