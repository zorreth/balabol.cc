# balabol.cc

Social landing page hosting and link shortener. A free and open-source Linktree alternative.

Use the hosted version at [balabol.cc](https://balabol.cc) or self-host it yourself.

**🚧 Currently under active development 🚧**

## Local Development

1. Clone the repository:
   ```bash
   git clone [https://github.com/zorreth/balabol.cc.git](https://github.com/zorreth/balabol.cc.git)
   cd balabol.cc
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables for all apps:
   ```bash
   cp apps/backend/.env.example apps/backend/.env # change DATABASE_URL, JWT_SECRET, provider IDs and secrets, etc...
   cp apps/web/.env.example apps/web/.env
   ```
4. Run the development server:
   ```bash
   bun run dev
   ```

## Stack

This repository is a **monorepo**, using [Bun](https://bun.com) as the package manager and runtime.

- **Backend** (apps/backend): Hono, Drizzle
- **Frontend** (apps/web): Next.js, Tailwind, shadcn-ui

## Contribute

I am open to any kinds of contributions, such as pull requests, idea suggestions, or donations through TON ([my telegram](https://t.me/zorreth)).

## License

The source code is licensed under the [MIT License](./LICENSE).

The logo uses graphics from [Twemoji](https://github.com/twitter/twemoji), licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0).
