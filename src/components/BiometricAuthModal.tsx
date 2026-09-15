import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Fingerprint, KeyRound, CheckCircle2, Delete } from 'lucide-react';

export interface BiometricAuthTarget {
  id: string;
  refCode?: string;
  title: string;
  recipient: string;
  amount: number;
  description?: string;
}

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (targetId: string) => void;
  target: BiometricAuthTarget | null;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  target
}) => {
  const [authMethod, setAuthMethod] = useState<'fingerprint' | 'pin'>('fingerprint');
  const [pin, setPin] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setIsScanning(false);
      setIsVerified(false);
      setPinError(null);
    }
  }, [isOpen]);

  if (!isOpen || !target) return null;

  // Simulate fingerprint scan
  const handleTriggerFingerprintScan = () => {
    if (isScanning || isVerified) return;
    setIsScanning(true);
    setPinError(null);

    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      setTimeout(() => {
        onSuccess(target.id);
        onClose();
      }, 700);
    }, 1100);
  };

  // Handle PIN input
  const handlePinDigit = (digit: string) => {
    if (pin.length >= 4 || isVerified) return;
    setPinError(null);
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      // Validate PIN: accept '1234' or any 4 digits, or specifically '1234'
      if (newPin === '1234' || newPin === '0000') {
        setIsVerified(true);
        setTimeout(() => {
          onSuccess(target.id);
          onClose();
        }, 700);
      } else {
        setTimeout(() => {
          setPinError('Incorrect PIN. Default executive PIN is 1234');
          setPin('');
        }, 400);
      }
    }
  };

  const handleBackspace = () => {
    setPinError(null);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClearPin = () => {
    setPinError(null);
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm rounded-2xl bg-surface-container-lowest border border-[#eaedff] shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-surface-container-low border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-on-primary" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-on-surface">Executive Biometric Guard</h3>
              <p className="text-[11px] text-on-surface-variant">HITL Sovereign Approval Authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cancel authorization"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-4 bg-surface-container-low/40 border-b border-surface-container-high">
          <div className="text-[11px] text-outline font-semibold uppercase tracking-wider mb-1">
            Authorizing Sensitive Action
          </div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[13px] font-bold text-on-surface line-clamp-1">{target.title}</p>
              <p className="text-[11px] text-on-surface-variant">
                Beneficiary: <strong className="text-on-surface">{target.recipient}</strong>
              </p>
              {target.refCode && (
                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-surface-container font-mono text-[10px] text-secondary font-bold">
                  {target.refCode}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-[16px] font-bold text-secondary font-mono">
                ₦{target.amount.toLocaleString()}
              </p>
              <span className="text-[10px] text-outline">NIBSS Realtime Outflow</span>
            </div>
          </div>
        </div>

        {/* Auth Method Switcher Tabs */}
        <div className="p-3 border-b border-surface-container-high flex items-center justify-center">
          <div className="inline-flex p-1 bg-surface-container-low rounded-xl border border-[#eaedff]">
            <button
              onClick={() => { setAuthMethod('fingerprint'); setPinError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                authMethod === 'fingerprint'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Fingerprint className="w-4 h-4 text-secondary" />
              <span>Fingerprint / Touch ID</span>
            </button>
            <button
              onClick={() => { setAuthMethod('pin'); setPinError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                authMethod === 'pin'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <KeyRound className="w-4 h-4 text-secondary" />
              <span>4-Digit PIN</span>
            </button>
          </div>
        </div>

        {/* Body 1: Fingerprint Simulation */}
        {authMethod === 'fingerprint' && (
          <div className="p-6 flex flex-col items-center text-center">
            {isVerified ? (
              <div className="flex flex-col items-center animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-secondary-container text-secondary flex items-center justify-center shadow-lg mb-3">
                  <CheckCircle2 className="w-10 h-10 text-secondary" />
                </div>
                <p className="text-[14px] font-bold text-secondary">Identity Verified</p>
                <p className="text-[12px] text-on-surface-variant">Alhaji Lateef Balogun (Owner)</p>
              </div>
            ) : (
              <>
                <button
                  onClick={handleTriggerFingerprintScan}
                  disabled={isScanning}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isScanning
                      ? 'bg-secondary-container text-secondary scale-105 shadow-xl'
                      : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface border-2 border-secondary/30 active:scale-95 shadow-md'
                  }`}
                  title="Click to simulate biometric fingerprint touch"
                >
                  {isScanning && (
                    <span className="absolute inset-0 rounded-full border-2 border-secondary animate-ping opacity-75"></span>
                  )}
                  <Fingerprint
                    className={`w-14 h-14 ${
                      isScanning ? 'animate-pulse text-secondary' : 'text-secondary'
                    }`}
                  />
                </button>

                <p className="mt-4 text-[13px] font-bold text-on-surface">
                  {isScanning ? 'Scanning Biometric Sensor...' : 'Touch sensor or click fingerprint'}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Simulating sovereign hardware-level executive key release
                </p>
              </>
            )}
          </div>
        )}

        {/* Body 2: Executive PIN Entry */}
        {authMethod === 'pin' && (
          <div className="p-4 flex flex-col items-center">
            {isVerified ? (
              <div className="py-6 flex flex-col items-center animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center shadow-lg mb-2">
                  <CheckCircle2 className="w-9 h-9 text-secondary" />
                </div>
                <p className="text-[14px] font-bold text-secondary">PIN Verified</p>
                <p className="text-[12px] text-on-surface-variant">Dispatched with executive signature</p>
              </div>
            ) : (
              <>
                {/* 4 Pin Indicators */}
                <div className="flex items-center gap-3 my-2">
                  {[0, 1, 2, 3].map((index) => {
                    const isFilled = pin.length > index;
                    return (
                      <div
                        key={index}
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                          isFilled
                            ? 'bg-secondary border-secondary scale-110'
                            : 'bg-surface-container border-outline/40'
                        }`}
                      />
                    );
                  })}
                </div>

                {pinError && (
                  <p className="text-[11px] font-semibold text-error text-center my-1 animate-fade-in">
                    {pinError}
                  </p>
                )}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 w-full max-w-[230px] mt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handlePinDigit(digit)}
                      className="h-10 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-bold text-[15px] flex items-center justify-center active:scale-95 transition-all shadow-sm border border-surface-container"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    onClick={handleClearPin}
                    className="h-10 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant text-[11px] font-semibold flex items-center justify-center active:scale-95 transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => handlePinDigit('0')}
                    className="h-10 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-bold text-[15px] flex items-center justify-center active:scale-95 transition-all shadow-sm border border-surface-container"
                  >
                    0
                  </button>
                  <button
                    onClick={handleBackspace}
                    className="h-10 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center active:scale-95 transition-all"
                    title="Backspace"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-outline text-center mt-2.5">
                  Default executive PIN: <strong className="text-on-surface">1234</strong>
                </p>
              </>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-surface-container-low border-t border-[#eaedff] flex items-center justify-between">
          <span className="text-[10px] text-outline flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>256-bit Secure Enclave</span>
          </span>
          <button
            onClick={onClose}
            disabled={isScanning || isVerified}
            className="px-3 py-1.5 rounded-lg border border-surface-container text-[12px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
