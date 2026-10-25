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
      const debug = url.searchParams.get('debug') === '1'
      const debugFetch = url.searchParams.get('debugFetch') === '1'

      const base = env.PORTFOLIO_BACKEND_BASE_URL || 'https://portfolio-backend.armedifaiz.workers.dev'

      const init: RequestInit = {
        method: request.method,
        headers: request.headers,
        redirect: 'manual',
      }

      // Avoid passing body for GET/HEAD.
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = request.body
      }

      if (debugFetch) {
        const backendUrl = `${base}${url.pathname}${url.search}`
        const backendResp = await fetch(backendUrl, init)
        return new Response(
          JSON.stringify({
            proxied: true,
            backendUrl,
            backendStatus: backendResp.status,
            backendContentType: backendResp.headers.get('content-type'),
          }),
          { headers: { 'content-type': 'application/json; charset=utf-8' } },
        )
      }

      if (debug) {
        return new Response(JSON.stringify({ path: url.pathname, debug: true, match: true }), {
          headers: { 'content-type': 'application/json; charset=utf-8' },
        })
      }

      return fetch(`${base}${url.pathname}${url.search}`, init)
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>

