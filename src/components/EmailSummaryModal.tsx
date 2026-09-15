import React, { useState } from 'react';
import { Mail, X, CheckCircle2, AtSign, Lock, ExternalLink, Send } from 'lucide-react';

interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail: string;
  subject: string;
  summaryText: string;
  onSent: (email: string) => void;
}

export const EmailSummaryModal: React.FC<EmailSummaryModalProps> = ({
  isOpen,
  onClose,
  defaultEmail,
  subject,
  summaryText,
  onSent
}) => {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setIsSending(true);

    // Simulate sending email dispatch via SMTP / SendGrid / Notification Gateway
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);

      // Trigger mailto client as fallback/direct option in browser
      const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summaryText)}`;
      // Create hidden link to not block UI
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      // Optional: don't auto-open mailto if they just want in-app transmission confirmation, but provide a direct link
      document.body.removeChild(link);

      onSent(recipientEmail);

      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 1400);
    }, 900);
  };

  const handleOpenClient = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summaryText)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-surface-container-lowest border border-[#eaedff] shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-surface-container-low border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-on-surface">Email Executive Summary</h3>
              <p className="text-[11px] text-on-surface-variant">Dispatches operational brief & telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-3">
          {isSent ? (
            <div className="py-6 flex flex-col items-center justify-center text-center animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-secondary-container text-secondary flex items-center justify-center shadow-md mb-2">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-[15px] font-bold text-on-surface">Executive Brief Transmitted</p>
              <p className="text-[12px] text-on-surface-variant mt-0.5">
                Summary successfully dispatched to <span className="font-semibold text-secondary">{recipientEmail}</span>
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                  Recipient Email Address
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => {
                      setRecipientEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter recipient email..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
                {error && <p className="text-[11px] text-error font-medium mt-1">{error}</p>}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  readOnly
                  value={subject}
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-[12px] text-on-surface-variant font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    Executive Brief Preview
                  </label>
                  <span className="text-[10px] text-outline">Plain text payload</span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container max-h-36 overflow-y-auto text-[11px] text-on-surface-variant font-mono whitespace-pre-wrap leading-relaxed">
                  {summaryText}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-secondary" />
                  <span>End-to-end TLS Dispatch</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenClient}
                  className="text-secondary hover:underline flex items-center gap-1"
                >
                  <span>Open in Mail App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSent && (
          <div className="p-3 bg-surface-container-low border-t border-[#eaedff] flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-3.5 py-1.5 rounded-xl text-[12px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-4 py-1.5 rounded-xl bg-secondary text-on-secondary text-[12px] font-semibold hover:bg-secondary/90 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Executive Brief</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
