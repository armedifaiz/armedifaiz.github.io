export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/__proxy_test') {
      const match = url.pathname.startsWith('/api/portfolio')
      return new Response(JSON.stringify({ path: url.pathname, match }), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
      })
    }

    // Proxy API calls to the CRUD worker.
    if (url.pathname.startsWith('/api/portfolio')) {
      const base = env.PORTFOLIO_BACKEND_BASE_URL || 'https://portfolio-backend.armedifaiz.workers.dev'
      return fetch(`${base}${url.pathname}${url.search}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'manual',
      })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>

