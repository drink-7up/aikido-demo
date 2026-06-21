# Task Tracker (Aikido demo target)

A tiny Express API used as a scan target for an Aikido Security demo. It is
intentionally **not** hardened — it exists so that connecting this repo (and
its Docker image / IaC) to Aikido produces real findings across:

- **Open source dependencies (SCA):** several deps pinned to old versions
  with known CVEs (`express`, `lodash`, `jsonwebtoken`, `axios`, `moment`,
  `body-parser`, `ejs`, `request`).
- **Secrets detection:** fake-but-realistic-looking API keys/tokens in
  `src/server.js`, `Dockerfile`, and `infra/deployment.yaml`. None of these
  are real credentials.
- **SAST (code vulnerabilities):**
  - SQL injection in `src/tasks.js` (string-concatenated query)
  - Reflected XSS in `src/users.js` (unescaped EJS render)
  - Command injection in `src/server.js` (`/admin/run` shells out to `exec`)
  - Weak hashing (MD5) for passwords in `src/users.js`
- **Container scanning:** `Dockerfile` uses an outdated Node base image and
  runs as root.
- **IaC scanning:** `infra/main.tf` has a public S3 bucket, unencrypted/
  publicly accessible RDS instance, and a security group open to
  `0.0.0.0/0` on port 22. `infra/deployment.yaml` runs a privileged
  container as root.

## Running locally

```bash
npm install
npm start
```

## Why this exists

Built as a connectable repo for an Aikido Security pre-sales/demo exercise —
intended to be forked/imported into a personal Aikido account to exercise
SCA, secrets, SAST, container, and IaC scanning in one place.
