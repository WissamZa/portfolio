import { supabaseAdmin } from './supabase';
import { stack } from './stack';

export async function logAudit(
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN',
  tableName: string,
  recordId: string | null = null,
  details: any = {}
) {
  try {
    const user = await stack.getUser();
    if (!user?.primaryEmail) return;

    await (supabaseAdmin as any).from('audit_logs').insert({
      user_email: user.primaryEmail,
      action,
      table_name: tableName,
      record_id: recordId,
      details,
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}
