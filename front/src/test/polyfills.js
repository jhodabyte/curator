const { TextEncoder, TextDecoder } = require("util");
Object.assign(global, { TextEncoder, TextDecoder });

if (!globalThis.fetch) {
  globalThis.fetch = jest.fn();
}
