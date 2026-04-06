'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Save, BookOpen, ExternalLink, Award } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Course } from '@/lib/database.types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { CourseForm } from './CourseForm';
import toast from 'react-hot-toast';

const EMPTY: Partial<Course> = {
  name_en: '', name_ar: '', provider_en: '', provider_ar: '',
  description_en: '', description_ar: '', course_url: '', certificate_url: '',
  order_index: 0,
};

export default function AdminCourses() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Course>('courses');
  const [editing, setEditing] = useState<Partial<Course> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (isNew) await createItem(editing);
      else await updateItem(editing.id!, editing);
      setEditing(null);
      fetchItems();
      toast.success(isNew ? 'Course added' : 'Course updated');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this course?')) {
      try {
        await deleteItem(id);
        fetchItems();
        toast.success('Course deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="Courses & Bootcamps"
        count={items.length}
        itemLabel="courses"
        onAdd={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
        addButtonLabel="Add Course"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="cyber-spinner" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-glass-border">
          <BookOpen size={48} className="mx-auto mb-4 text-text-muted/30" />
          <p className="font-mono text-text-muted text-sm uppercase tracking-widest">No courses found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((course) => (
            <div key={course.id} className="glass-card p-5 group hover:border-neon-purple/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary text-sm tracking-wide truncate">{course.name_en}</h3>
                    <p className="text-[10px] text-neon-purple font-mono uppercase mt-1">{course.provider_en}</p>
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditing({ ...course }); setIsNew(false); }}
                      className="w-7 h-7 flex items-center justify-center border border-glass-border text-text-muted hover:text-neon-purple hover:border-neon-purple/30 transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="w-7 h-7 flex items-center justify-center border border-glass-border text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-glass-border/50 pt-3">
                  {course.completion_date && (
                    <p className="font-mono text-[10px] text-text-muted flex justify-between">
                      <span>COMPLETED:</span>
                      <span className="text-text-primary">
                        {new Date(course.completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </span>
                    </p>
                  )}
                  {course.description_en && (
                    <p className="text-[10px] text-text-muted line-clamp-2 mt-2">
                       {course.description_en}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {course.certificate_url && (
                    <a
                      href={course.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 text-[10px] text-neon-purple hover:text-white border border-neon-purple/20 hover:bg-neon-purple/10 py-2 font-mono uppercase tracking-widest transition-all"
                    >
                      <Award size={10} /> Certificate
                    </a>
                )}
                {course.course_url && (
                    <a
                      href={course.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 text-[10px] text-text-muted hover:text-white border border-glass-border hover:bg-white/5 py-2 font-mono uppercase tracking-widest transition-all"
                    >
                      <ExternalLink size={10} /> Link
                    </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        title={isNew ? 'New Course' : 'Edit Course'}
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button onClick={() => setEditing(null)} className="btn-neon px-4 py-2 text-sm font-mono">Cancel</button>
            <button onClick={handleSave} className="btn-neon-filled px-4 py-2 text-sm font-mono flex items-center gap-2">
              <Save size={14} /> Save
            </button>
          </>
        }
      >
        {editing && <CourseForm editing={editing} setEditing={setEditing} />}
      </AdminModal>
    </div>
  );
}
