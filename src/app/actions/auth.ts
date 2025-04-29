'use server';

import { cookies } from 'next/headers';
import { login, register } from '@/services/api';

export async function loginAction(email: string) {
  try {
    const response = await login(email);
    const cookieStore = await cookies();
    await cookieStore.set('user', JSON.stringify(response.user));
    await cookieStore.set('token', response.token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export async function registerAction(username: string, email: string) {
  try {
    const response = await register(username, email);
    const cookieStore = await cookies();
    await cookieStore.set('user', JSON.stringify(response.user));
    await cookieStore.set('token', response.token);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  await cookieStore.delete('user');
  await cookieStore.delete('token');
  return { success: true };
} 