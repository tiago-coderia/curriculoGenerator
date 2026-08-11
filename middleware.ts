import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'autoresume_auth_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authorizedEmail = (process.env.AUTHORIZED_EMAIL || '').toLowerCase().trim();

  // Permitir acesso a recursos estáticos e rotas públicas de autenticação
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/check') ||
    pathname.startsWith('/api/auth/setup') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      const [base64Payload] = token.split('.');
      if (base64Payload) {
        const payload = atob(base64Payload);
        const [email] = payload.split(':');
        if (email && (!authorizedEmail || email.toLowerCase().trim() === authorizedEmail)) {
          isAuthenticated = true;
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Se o usuário está tentando acessar a página de login
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Se não estiver autenticado, redireciona rotas da aplicação para /login
  if (!isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
