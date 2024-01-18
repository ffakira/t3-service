# Backend Tic Tac Toe

To allow users to play against each other, we are required to setup `socket.io` to accept live connection.

## Initialize

Run with Dockerfile 🐋
```sh
# This will spin up docker compose running Express App and PostgreSQL
$ docker compose up
```

Or you can simply run with node
```sh
# Install node modules
$ yarn

# Run in dev environment
$ yarn dev

# Run unit tests
$ yarn test
```

## Environment Variables

You can look in `package.json` as `process.env.NODE_ENV` is passed during runtime

```
PORT=8080
SENTRY_DNS=<sentry dns>

POSTGRES_USER=<db_user>
POSTGRES_PASSWORD=<db_password>
POSTGRES_DB=<postgres_db>

COOKIE_SECRET=<cookie secret>
```
