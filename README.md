# Matrix Admin Bridge Kit

Matrix Admin Bridge Kit is a small command-line helper for teams that want to
connect an existing business admin system to Matrix/Synapse and Element Web.
It reads a JSON deployment profile, checks common readiness gaps, and prints a
short report that can be used before implementation or production rollout.

The first release focuses on the operational boundaries that are easy to miss:
Synapse admin API exposure, PostgreSQL usage, Element Web routing, TURN support,
SSO planning, and group-call infrastructure.

## Why this exists

Many Matrix integration projects start from a simple goal: add chat, voice, and
video to an existing admin platform. The hard part is not only calling the
Matrix APIs. Teams also need to keep business permissions authoritative,
protect Synapse admin endpoints, plan identity, and decide where Element Web,
TURN, and MatrixRTC components fit.

This tool turns those concerns into repeatable checks.

## Quick Start

```bash
git clone https://github.com/yangjl114/matrix-admin-bridge-kit.git
cd matrix-admin-bridge-kit
npm test
npm run check
```

Run the CLI against your own profile:

```bash
node src/index.js path/to/config.json
```

## Example Profile

```json
{
  "homeserver": {
    "implementation": "synapse",
    "database": "postgresql",
    "adminApiPublic": false
  },
  "client": {
    "elementWeb": true,
    "embeddedInAdmin": true
  },
  "identity": {
    "sso": true,
    "businessSystemOwnsPermissions": true
  },
  "realtime": {
    "turn": true,
    "groupCalls": true,
    "livekit": true,
    "matrixRtcJwtService": true
  }
}
```

## Report Levels

- `pass`: the profile contains the expected production-ready choice.
- `warn`: the profile can work, but the rollout should explicitly address the
  risk.
- `fail`: the profile has a security or reliability gap that should be fixed
  before production.

## Project Status

This is an early public project. It currently provides local static checks and
is intentionally dependency-free. Planned improvements include:

- Markdown and JSON report output.
- More MatrixRTC and Element Call deployment checks.
- Sample Nginx and container deployment templates.
- A maintained checklist for production Synapse admin integrations.

## Contributing

Issues and pull requests are welcome. Useful contributions include additional
checks, real deployment lessons, documentation fixes, and examples for common
Matrix/Synapse topologies.

## License

MIT
