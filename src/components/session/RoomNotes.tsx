'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { StickyNote, ChevronDown, ChevronUp } from 'lucide-react';

interface RoomNotesProps {
  notes: string;
  isCreator: boolean;
  sessionId: string;
  onNotesChange: (notes: string) => void;
  onEditingChange: (isEditing: boolean) => void;
  themeColor?: string;
}

export function RoomNotes({ notes, isCreator, sessionId, onNotesChange, onEditingChange, themeColor }: RoomNotesProps) {
  const { theme } = useTheme();
  const { put } = useApi();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from parent when not editing
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const saveNotes = useCallback(async (value: string) => {
    setSaveStatus('saving');
    try {
      await put(ENDPOINTS.SESSIONS.MANAGE.UPDATE.path(sessionId), { notes: value });
      onNotesChange(value);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err) {
      console.error('Failed to save notes:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [put, sessionId, onNotesChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalNotes(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNotes(value), 500);
  };

  const handleFocus = () => {
    onEditingChange(true);
  };

  const handleBlur = () => {
    onEditingChange(false);
    // Flush save on blur
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    saveNotes(localNotes);
  };

  // Non-creator with empty notes: hide entirely
  if (!isCreator && !notes.trim()) {
    return null;
  }

  const statusText = saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Failed to save' : '';

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-2">
      {isExpanded ? (
        <div
          className="rounded-lg p-3"
          style={{
            backgroundColor: `${themeColor || theme.brand.background}08`,
            border: `1px dashed ${theme.border}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" style={{ color: themeColor || theme.brand.background }} />
              <span className="text-xs font-semibold" style={{ color: theme.typography.secondary }}>Room Notes</span>
              {statusText && (
                <span className="text-xs" style={{ color: saveStatus === 'error' ? theme.error.DEFAULT : theme.typography.secondary }}>
                  {statusText}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="cursor-pointer p-1 rounded transition-colors hover:opacity-70"
              style={{ color: theme.typography.secondary }}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          {isCreator ? (
            <textarea
              value={localNotes}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Add notes... (intentions, motivation, messages for your study partners)"
              className="w-full bg-transparent text-sm resize-none outline-none min-h-[60px]"
              style={{ color: theme.typography.primary }}
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap" style={{ color: theme.typography.primary }}>
              {notes}
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="cursor-pointer w-full flex items-center gap-2 py-2 px-3 rounded-lg transition-colors hover:opacity-80"
          style={{
            backgroundColor: `${themeColor || theme.brand.background}08`,
            border: `1px dashed ${theme.border}`,
          }}
        >
          <StickyNote className="w-4 h-4 shrink-0" style={{ color: themeColor || theme.brand.background }} />
          <span className="text-xs font-medium" style={{ color: theme.typography.secondary }}>Room notes</span>
          {notes.trim() && (
            <span className="text-xs truncate flex-1 text-left" style={{ color: theme.typography.secondary }}>
              {notes.slice(0, 80)}{notes.length > 80 ? '...' : ''}
            </span>
          )}
          <ChevronDown className="w-4 h-4 shrink-0" style={{ color: theme.typography.secondary }} />
        </button>
      )}
    </div>
  );
}
