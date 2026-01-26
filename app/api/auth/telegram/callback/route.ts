import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAuthClient } from '@neondatabase/neon-js/auth';
import { neon } from '@neondatabase/serverless';

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

function verifyTelegramAuth(authData: TelegramAuthData): boolean {
  const { hash, ...data } = authData;
  
  const checkString = Object.keys(data)
    .sort()
    .filter(key => data[key as keyof typeof data] !== undefined)
    .map(key => `${key}=${data[key as keyof typeof data]}`)
    .join('\n');
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Bot token not configured');
  }

  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();
  
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');
  
  if (hmac !== hash) {
    return false;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - data.auth_date > 86400) {
    return false;
  }
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const telegramData: TelegramAuthData = await request.json();
    
    // Verify Telegram authentication
    if (!verifyTelegramAuth(telegramData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication data' },
        { status: 401 }
      );
    }

    // Get origin from request
    const origin = request.headers.get('origin') || 
                   request.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
                   'http://localhost:3000';

    // Initialize database and auth client
    const sql = neon(process.env.DATABASE_URL!);
    const auth = createAuthClient(process.env.NEON_AUTH_BASE_URL!, {
      fetchOptions: {
        headers: {
          'Origin': origin,
        }
      }
    });
    
    // Create unique email and deterministic password
    const telegramEmail = `telegram_${telegramData.id}@telegram.local`;
    const password = crypto
      .createHmac('sha256', process.env.TELEGRAM_BOT_TOKEN!)
      .update(telegramData.id.toString())
      .digest('hex');

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM neon_auth.user 
      WHERE email = ${telegramEmail}
      LIMIT 1
    `;

    let result;

    if (existingUser.length > 0) {
      // User exists - sign them in
      console.log('✅ Existing user, signing in...');
      result = await auth.signIn.email({
        email: telegramEmail,
        password: password,
        callbackURL: `${origin}/lobby`,
      });
    } else {
      // User doesn't exist - sign them up
      console.log('✅ New user, creating account...');
      result = await auth.signUp.email({
        email: telegramEmail,
        password: password,
        name: `${telegramData.first_name} ${telegramData.last_name || ''}`.trim(),
        image: telegramData.photo_url,
        callbackURL: `${origin}/lobby`,
      });
    }

    if (result.error || !result.data) {
      console.error('Auth error:', result.error);
      return NextResponse.json(
        { success: false, error: result.error?.message || 'Authentication failed' },
        { status: 500 }
      );
    }

    console.log('✅ Authentication successful');
    return NextResponse.json(
      { 
        success: true, 
        user: result.data.user,
        session: result.data.session,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}