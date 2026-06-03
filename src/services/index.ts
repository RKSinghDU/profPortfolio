import { EmailService } from './EmailService';
import { ThemeManager } from './ThemeManager';
import { YouTubeAPI } from './YouTubeAPI';

export const youtubeAPI = new YouTubeAPI(import.meta.env.VITE_YOUTUBE_API_KEY ?? '');

export const emailService = new EmailService({
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
});

export const themeManager = new ThemeManager();

export type { YouTubeVideo } from './YouTubeAPI';
export type { ContactMessage } from './EmailService';
export type { Theme } from './ThemeManager';
