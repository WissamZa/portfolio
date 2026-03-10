export interface AuditLog {
    id: string;
    user_email: string;
    action: string;
    table_name: string;
    record_id: string;
    details: Record<string, any> | null;
    created_at: string;
}

export type RollbackStatus = 'idle' | 'loading' | 'success' | 'error';
