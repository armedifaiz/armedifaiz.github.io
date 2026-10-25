export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Workers Assets binding (provided automatically by Wrangler when using `assets`).
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>

