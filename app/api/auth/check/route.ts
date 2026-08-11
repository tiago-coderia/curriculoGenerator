import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthorizedEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').toLowerCase().trim();
    const targetEmail = getAuthorizedEmail();

    if (!targetEmail || email !== targetEmail) {
      return NextResponse.json(
        {
          authorized: false,
          error: 'E-mail não autorizado ou não encontrado.',
        },
        { status: 403 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: targetEmail,
          password: null,
        },
      });
    }

    const hasPassword = Boolean(user.password && user.password.trim().length > 0);

    return NextResponse.json({
      authorized: true,
      hasPassword,
      email: targetEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao verificar permissão do e-mail.' },
      { status: 500 }
    );
  }
}
