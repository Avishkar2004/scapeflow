import { Metadata } from 'next';

declare module 'next' {
  interface PageProps {
    params: Promise<{ [key: string]: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
} 