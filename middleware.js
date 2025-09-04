import { NextResponse } from "next/server"

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Se é rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Para outras rotas, verificar se tem token no localStorage (client-side)
  // Como middleware roda no servidor, vamos deixar o client-side handle isso
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
