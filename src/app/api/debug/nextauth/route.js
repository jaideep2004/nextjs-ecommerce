import { NextResponse } from 'next/server';

export async function GET() {
  // Test if NextAuth can initialize without errors
  try {
    const { authOptions } = await import('../[...nextauth]/route');
    
    return NextResponse.json({
      status: 'success',
      message: 'NextAuth configuration loaded successfully',
      providers: authOptions.providers.map(p => p.id || p.name),
      hasSecret: !!authOptions.secret,
      secretLength: authOptions.secret ? authOptions.secret.length : 0
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'NextAuth configuration failed',
      error: error.message
    }, { status: 500 });
  }
}