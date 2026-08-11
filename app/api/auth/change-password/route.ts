import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { getAuthorizedEmail, verifySessionToken, verifyPassword, hashPassword, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);

    if (!session || !session.valid) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const targetEmail = getAuthorizedEmail() || session.email;
    const { currentPassword, newPassword, confirmNewPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve possuir no mínimo 6 caracteres.' }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: 'A nova senha e a confirmação não coincidem.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Senha atual não cadastrada.' }, { status: 400 });
    }

    const isCurrentValid = verifyPassword(currentPassword, user.password);
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'A senha atual informada está incorreta.' }, { status: 400 });
    }

    const newHash = hashPassword(newPassword);
    await prisma.user.update({
      where: { email: targetEmail },
      data: { password: newHash },
    });

    return NextResponse.json({ success: true, message: 'Senha alterada com sucesso!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao alterar a senha.' }, { status: 500 });
  }
}
