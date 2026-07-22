import { useState, useEffect, useRef, useCallback } from 'react';
import { SaveStatus } from '../types';

interface UseAutosaveProps<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delayMs?: number;
  enabled?: boolean;
}

export function useAutosave<T>({
  data,
  onSave,
  delayMs = 2000,
  enabled = true,
}: UseAutosaveProps<T>) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const initialRender = useRef(true);
  const previousDataRef = useRef<T>(data);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saveImmediately = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSaveStatus('saving');
    try {
      await onSave(data);
      setSaveStatus('saved');
      previousDataRef.current = data;
    } catch (error) {
      console.error('Autosave error:', error);
      setSaveStatus('error');
    }
  }, [data, onSave]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      previousDataRef.current = data;
      return;
    }

    if (!enabled) return;

    // Check if data actually changed
    if (JSON.stringify(previousDataRef.current) === JSON.stringify(data)) {
      return;
    }

    setSaveStatus('saving');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        await onSave(data);
        setSaveStatus('saved');
        previousDataRef.current = data;
      } catch (error) {
        console.error('Autosave failed:', error);
        setSaveStatus('error');
      }
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, delayMs, enabled, onSave]);

  return { saveStatus, setSaveStatus, saveImmediately };
}
