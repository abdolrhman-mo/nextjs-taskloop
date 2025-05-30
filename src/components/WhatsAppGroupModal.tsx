import React from 'react';
import { theme } from '@/config/theme';
import Image from 'next/image';

interface WhatsAppGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/BWqf0zbSjLJB3wwR7TgSFu';

export function WhatsAppGroupModal({ isOpen, onClose }: WhatsAppGroupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div
        className="rounded-2xl shadow-xl p-6 max-w-md w-full relative flex flex-col items-center"
        style={{
          backgroundColor: theme.background.secondary,
          color: theme.typography.primary,
          border: `1px solid ${theme.border}`
        }}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold focus:outline-none"
          aria-label="Close"
          style={{ color: theme.typography.secondary }}
        >
          ×
        </button>
        <div className="mb-4 rounded-lg shadow" style={{ border: `1px solid ${theme.border}` }}>
          <Image
            src="/whatsapp-group-qr.jpg"
            alt="WhatsApp Group QR Code"
            width={160}
            height={160}
            className="rounded-lg"
            priority
          />
        </div>
        <h2 className="text-lg font-semibold mb-2 text-center">Join our WhatsApp group!</h2>
        <p className="text-center mb-4 text-sm" style={{ color: theme.typography.secondary }}>
          Join our WhatsApp group to get early updates on TaskLoop, share your feedback, and help shape new features!
        </p>
        <a
          href={WHATSAPP_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-block text-center px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: theme.brand.background,
            color: theme.brand.text,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          Join WhatsApp Group
        </a>
      </div>
    </div>
  );
} 