import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthorizedEmail, hashPassword, generateSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').toLowerCase().trim();
    const { password, confirmPassword } = body;
    const targetEmail = getAuthorizedEmail();

    if (!targetEmail || email !== targetEmail) {
      return NextResponse.json(
        { error: 'E-mail não autorizado ou não encontrado.' },
        { status: 403 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve possuir no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'A senha e a confirmação de senha não coincidem.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (user && user.password) {
      return NextResponse.json(
        { error: 'A senha para esta conta já foi configurada anteriormente. Por favor faça login.' },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    if (user) {
      await prisma.user.update({
        where: { email: targetEmail },
        data: { password: passwordHash },
      });
    } else {
      await prisma.user.create({
        data: {
          email: targetEmail,
          password: passwordHash,
        },
      });
    }

    const token = generateSessionToken(targetEmail);
    const response = NextResponse.json({
      success: true,
      message: 'Senha configurada com sucesso!',
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
      { error: 'Erro ao configurar a senha no primeiro acesso.' },
      { status: 500 }
    );
  }
}
