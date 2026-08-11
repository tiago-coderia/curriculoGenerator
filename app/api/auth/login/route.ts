import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthorizedEmail, verifyPassword, generateSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').toLowerCase().trim();
    const { password } = body;
    const targetEmail = getAuthorizedEmail();

    if (!targetEmail || email !== targetEmail) {
      return NextResponse.json(
        { error: 'E-mail não autorizado ou não encontrado.' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Senha não configurada. Por favor, faça a definição inicial de senha.', isSetupRequired: true },
        { status: 400 }
      );
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Senha incorreta. Verifique os dados e tente novamente.' },
        { status: 401 }
      );
    }

    const token = generateSessionToken(targetEmail);
    const response = NextResponse.json({
      success: true,
      email: targetEmail,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao processar o login.' },
      { status: 500 }
    );
  }
}
