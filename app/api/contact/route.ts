import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('contact_messages').insert(parsed.data as any);

    if (error) throw error;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramBotToken && telegramChatId) {
      try {
        const text = `📬 <b>New Contact Message</b>\n\n` +
                     `<b>Name:</b> ${parsed.data.name}\n` +
                     `<b>Email:</b> ${parsed.data.email}\n` +
                     `<b>Subject:</b> ${parsed.data.subject || 'N/A'}\n` +
                     `<b>Message:</b>\n${parsed.data.message}`;
                     
        const tgRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: telegramChatId, 
            text,
            parse_mode: 'HTML'
          })
        });
        
        if (!tgRes.ok) {
          const errorData = await tgRes.json();
          console.error('Telegram API error:', errorData);
        }
      } catch (tgError) {
        console.error('Failed to send to Telegram:', tgError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
