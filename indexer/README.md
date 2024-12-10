# Indexer

`indexer` handle payment processor on Solana and notification for other service payment status.

# Feature

- Handle Solana payment for Playshub shop
- Send proceed payment events via webhooks

# Technique

- Nestjs: Index work and parse Solana transaction and express api server
- Socket.io: Push payment transaction to game server
- @solana/web3js:

# How to run

## Running locally

- Install package dependencies

```shell
pnpm install
```

- Prepare environment variables

```shell
cp .env.example .env
```

- Start

```shell
- dev: pnpm run start:dev
- prod: pnpm run build & pnpm run start
```

# Project Structure

```
playshub-blockchain/
├── src/
│   ├── modules/
│   │   ├── account-subscriber/
│   │   ├── notification/
│   │   └── solana-rpc/
│   ├── types/
│   ├── utils/
│   ├── app.module.ts
│   └── main.ts
├── .gitignore
├── package.json
└── README.md
```

- `src/`:` Contains the source code, including components and styles.
- `modules/account-subscriber`: Handle payment by Solana by polling
- `modules/notification`: Send `ws` or `webhook` for service listeners
- `modules/solana-rpc`: Solana client
- `utils/`: Contains utility functions, classes, and other helper modules that are used throughout the project
- `main.ts`: Entry point for the React application.

# Authors and acknowledgment

Playshub Team

# License

This project is licensed under the MIT License. See the LICENSE file for details.

# Project status

We are still developing this project following the roadmap in here: https://playshub.io/
