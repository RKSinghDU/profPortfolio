import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { emailService } from '../services';
import type { ContactMessage } from '../services';

export type SubmitStatus = 'idle' | 'success' | 'error';

const EMPTY_MESSAGE: ContactMessage = { from_name: '', from_email: '', message: '' };
const STATUS_RESET_MS = 5000;

export interface UseContactFormResult {
  data: ContactMessage;
  submitting: boolean;
  status: SubmitStatus;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export function useContactForm(): UseContactFormResult {
  const [data, setData] = useState<ContactMessage>(EMPTY_MESSAGE);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data.from_name.trim() || !data.from_email.trim() || !data.message.trim()) {
      alert('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    setStatus('idle');
    try {
      await emailService.send(data);
      setStatus('success');
      setData(EMPTY_MESSAGE);
    } catch (err) {
      console.error('Email send error:', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus('idle'), STATUS_RESET_MS);
    }
  };

  return { data, submitting, status, handleChange, handleSubmit };
}
