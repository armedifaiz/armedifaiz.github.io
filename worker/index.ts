export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // Enforce admin UI on the portfolio subdomain only.
    // If someone hits `faizarmedi.com/admin*`, redirect them to
    // `https://portfolio.faizarmedi.com/admin/`.
    const isAdminPath =
      url.pathname === '/admin' ||
      url.pathname === '/admin.html' ||
      url.pathname.startsWith('/admin/')

    if (isAdminPath && url.hostname !== 'portfolio.faizarmedi.com') {
      const target = new URL('/admin/', 'https://portfolio.faizarmedi.com')
      target.search = url.search
      return Response.redirect(target.toString(), 302)
    }

    // Proxy API calls to the CRUD worker.
    if (url.pathname.startsWith('/api/portfolio')) {
      const base = env.PORTFOLIO_BACKEND_BASE_URL || 'https://portfolio-backend.armedifaiz.workers.dev'

      const forwardedHeaders = new Headers()

      // Forward only a safe subset to avoid sending problematic headers like `host`.
      for (const [key, value] of request.headers.entries()) {
        const lower = key.toLowerCase()
        if (
          lower === 'authorization' ||
          lower === 'content-type' ||
          lower === 'accept' ||
          lower === 'user-agent' ||
          lower === 'origin' ||
          lower === 'referer' ||
          lower === 'accept-language'
        ) {
          forwardedHeaders.set(key, value)
        } else if (lower.startsWith('cf-access-')) {
          forwardedHeaders.set(key, value)
        }
      }

      const init: RequestInit = {
        method: request.method,
        headers: forwardedHeaders,
        redirect: 'manual',
      }

      // Avoid passing body for GET/HEAD.
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = request.body
      }

      return fetch(`${base}${url.pathname}${url.search}`, init)
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>

