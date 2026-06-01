"use strict";

const CHECKS = [
  {
    id: "homeserver.synapse",
    level: "fail",
    ok: (profile) => get(profile, "homeserver.implementation") === "synapse",
    pass: "Synapse is selected as the Matrix homeserver.",
    fail: "Select Synapse or document why another homeserver supports the required admin workflows."
  },
  {
    id: "homeserver.postgresql",
    level: "warn",
    ok: (profile) => get(profile, "homeserver.database") === "postgresql",
    pass: "PostgreSQL is configured for homeserver storage.",
    fail: "Use PostgreSQL for production Synapse deployments instead of SQLite."
  },
  {
    id: "security.admin-api-private",
    level: "fail",
    ok: (profile) => get(profile, "homeserver.adminApiPublic") === false,
    pass: "Synapse admin APIs are not exposed publicly.",
    fail: "Keep Synapse admin APIs private and reachable only by trusted backend services."
  },
  {
    id: "client.element-web",
    level: "warn",
    ok: (profile) => get(profile, "client.elementWeb") === true,
    pass: "Element Web is included as the user-facing Matrix client.",
    fail: "Plan a Matrix client. Element Web is the usual low-risk starting point."
  },
  {
    id: "identity.business-authority",
    level: "fail",
    ok: (profile) => get(profile, "identity.businessSystemOwnsPermissions") === true,
    pass: "Business permissions remain authoritative outside Matrix.",
    fail: "Keep project membership and authorization in the business system, then sync it to Matrix."
  },
  {
    id: "identity.sso",
    level: "warn",
    ok: (profile) => get(profile, "identity.sso") === true,
    pass: "SSO is planned for production login.",
    fail: "Plan SSO/OIDC before production to avoid fragile token handoff flows."
  },
  {
    id: "realtime.turn",
    level: "warn",
    ok: (profile) => get(profile, "realtime.turn") === true,
    pass: "TURN is included for WebRTC connectivity.",
    fail: "Add a TURN service such as coturn for reliable voice and video connections."
  },
  {
    id: "realtime.group-calls",
    level: "warn",
    ok: (profile) => {
      if (get(profile, "realtime.groupCalls") !== true) {
        return true;
      }

      return get(profile, "realtime.livekit") === true &&
        get(profile, "realtime.matrixRtcJwtService") === true;
    },
    pass: "Group calls have the expected media and JWT service pieces.",
    fail: "For MatrixRTC group calls, plan LiveKit and an lk-jwt-service compatible authorization service."
  }
];

function get(object, path) {
  return path.split(".").reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key];
    }

    return undefined;
  }, object);
}

function evaluate(profile) {
  const results = CHECKS.map((check) => {
    const passed = Boolean(check.ok(profile));

    return {
      id: check.id,
      status: passed ? "pass" : check.level,
      message: passed ? check.pass : check.fail
    };
  });

  return {
    results,
    summary: summarize(results)
  };
}

function summarize(results) {
  return results.reduce((summary, result) => {
    summary[result.status] = (summary[result.status] || 0) + 1;
    return summary;
  }, { pass: 0, warn: 0, fail: 0 });
}

module.exports = {
  CHECKS,
  evaluate,
  get,
  summarize
};
