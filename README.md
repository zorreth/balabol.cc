# 😎 balabol.cc

A free and open-source link-in-bio platform.

Try the hosted version at [balabol.cc](https://balabol.cc), or self-host your own instance.

**🚧 Currently under development. Not yet ready for production. 🚧**

## Stack

This repository is a **monorepo**, using [Bun](https://bun.com) as the package manager and runtime.

- **Backend** (apps/backend): Hono, Drizzle
- **Frontend** (apps/web): Next.js, Tailwind, shadcn-ui

## Prerequisites

1. [Bun](https://bun.com)
2. [Docker](https://docker.com)

## Getting Started

1. Clone the repository:
   ```bash
   git clone [https://github.com/zorreth/balabol.cc.git](https://github.com/zorreth/balabol.cc.git)
   cd balabol.cc
   ```
2. Run Postgres using Docker Compose:
   ```bash
   docker compose up -d
   ```
3. Install dependencies and run database migrations:
   ```bash
   bun install
   bun run db:migrate
   ```
4. Copy configuration files for the frontend and backend:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/web/.env.example apps/web/.env
   ```

   See & edit them to match your needs.

5. Run development server:
   ```bash
   bun run dev
   ```

## Contribution

Contributions of all kinds are welcome: pull requests, idea suggestions, or donations. Contact me on [Telegram](https://t.me/zorreth) or visit [my website](https://zorreth.com) for more information.

## License

The source code is licensed under the [MIT License](./LICENSE).

The logo uses graphics from [Twemoji](https://github.com/twitter/twemoji), licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0).
