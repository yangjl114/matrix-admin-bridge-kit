"use strict";

const assert = require("assert");
const { evaluate, get, summarize } = require("../src/rules");

const productionProfile = {
  homeserver: {
    implementation: "synapse",
    database: "postgresql",
    adminApiPublic: false
  },
  client: {
    elementWeb: true
  },
  identity: {
    sso: true,
    businessSystemOwnsPermissions: true
  },
  realtime: {
    turn: true,
    groupCalls: true,
    livekit: true,
    matrixRtcJwtService: true
  }
};

assert.strictEqual(get(productionProfile, "homeserver.implementation"), "synapse");
assert.strictEqual(get(productionProfile, "missing.path"), undefined);

const ready = evaluate(productionProfile);
assert.deepStrictEqual(ready.summary, { pass: 8, warn: 0, fail: 0 });

const risky = evaluate({
  homeserver: {
    implementation: "synapse",
    database: "sqlite",
    adminApiPublic: true
  },
  identity: {
    businessSystemOwnsPermissions: false
  },
  realtime: {
    groupCalls: true
  }
});

assert.strictEqual(risky.summary.fail, 2);
assert.strictEqual(risky.summary.warn, 5);
assert.deepStrictEqual(
  summarize([{ status: "pass" }, { status: "warn" }, { status: "warn" }]),
  { pass: 1, warn: 2, fail: 0 }
);

console.log("rules.test.js: all checks passed");
