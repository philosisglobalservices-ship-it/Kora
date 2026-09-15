import React, { useState, useRef, useEffect } from 'react';
import { ApprovalItem, ChatMessage } from '../../types';
import { EmailSummaryModal } from '../EmailSummaryModal';
import {
  Brain,
  Network,
  Shield,
  Store,
  ShieldCheck,
  Mail,
  MailCheck,
  X,
  Sparkles,
  Activity,
  CreditCard,
  Package,
  Award,
  Gavel,
  Fingerprint,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ChevronRight,
  MessageSquare,
  Mic,
  MicOff,
  Send
} from 'lucide-react';

interface AiCeoScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  pendingPO: ApprovalItem;
  onApprovePO: (poId: string) => void;
  onModifyPO: (poId: string, customTerms?: string) => void;
  onOpenSqlModal: () => void;
  onOpenProfileModal: () => void;
  onOpenBranchModal: () => void;
  executiveMode: string;
  isWhatsAppActive: boolean;
  onToggleWhatsApp: () => void;
  sqlQueriesCount: number;
  userEmail?: string;
}

export const AiCeoScreen: React.FC<AiCeoScreenProps> = ({
  messages,
  onSendMessage,
  pendingPO,
  onApprovePO,
  onModifyPO,
  onOpenSqlModal,
  onOpenProfileModal,
  onOpenBranchModal,
  executiveMode,
  isWhatsAppActive,
  onToggleWhatsApp,
  sqlQueriesCount,
  userEmail = 'philosisglobalservices@gmail.com'
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailNotificationToast, setEmailNotificationToast] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const query = inputText.trim();
    setInputText('');
    setIsThinking(true);
    setTimeout(() => {
      onSendMessage(query);
      setIsThinking(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleChipClick = (probeText: string) => {
    setInputText(probeText);
    setIsThinking(true);
    setTimeout(() => {
      onSendMessage(probeText);
      setInputText('');
      setIsThinking(false);
    }, 500);
  };

  // Generate comprehensive Executive Summary text from the latest chat response and telemetry report
  const generateExecutiveReportText = (targetMsg?: ChatMessage) => {
    // Find the latest agent message if not provided
    const latestAgentMsg = targetMsg || [...messages].reverse().find(m => m.sender === 'agent');
    const timestampStr = latestAgentMsg?.timestamp || 'Latest Realtime Cycle';

    let report = `=====================================================
KORAOPS AI CEO EXECUTIVE SUMMARY REPORT
Tenant: Balogun Mega Traders Ltd (Lagos State, Nigeria)
Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Generated: ${timestampStr}
Orchestrator Mode: ${executiveMode}
Telemetry Status: 7 Sub-Agents Online • Postgres Layer Synchronized
=====================================================\n\n`;

    if (latestAgentMsg?.content) {
      report += `[LATEST STRATEGIC SYNTHESIS]\n${latestAgentMsg.content}\n\n`;
    }

    if (latestAgentMsg?.operationalVitality) {
      report += `[OPERATIONAL VITALITY INDEX]\n`;
      report += `• Health Score: ${latestAgentMsg.operationalVitality.healthScore}/100\n`;
      report += `• Status: ${latestAgentMsg.operationalVitality.headline}\n\n`;
    }

    if (latestAgentMsg?.velocityMetric) {
      report += `[SALES VELOCITY METRIC]\n`;
      report += `• Metric: ${latestAgentMsg.velocityMetric.label}\n`;
      report += `• Trend: ${latestAgentMsg.velocityMetric.changeText}\n\n`;
    }

    if (latestAgentMsg?.telemetryReports && latestAgentMsg.telemetryReports.length > 0) {
      report += `[SUB-AGENT REALTIME TELEMETRY REPORTS]\n`;
      latestAgentMsg.telemetryReports.forEach((rep, idx) => {
        report += `${idx + 1}. ${rep.agentName} [${rep.badge}]\n`;
        report += `   ${rep.body}\n`;
        if (rep.repName) report += `   Representative: ${rep.repName} (${rep.dealsCount || ''})\n`;
        report += `\n`;
      });
    }

    if (pendingPO) {
      report += `[HUMAN-IN-THE-LOOP AUTHORIZATION DISPATCH]\n`;
      report += `• Document: ${pendingPO.refCode} (${pendingPO.category})\n`;
      report += `• Recipient: ${pendingPO.supplierOrClient}\n`;
      report += `• Amount: ₦${pendingPO.amount.toLocaleString()}\n`;
      report += `• Risk Assessment: ${pendingPO.risk}\n`;
      report += `• Approval Status: ${pendingPO.status === 'approved' ? 'AUTHORIZED & TRANSMITTED VIA NIBSS' : 'PENDING BIOMETRIC AUTHORIZATION'}\n`;
      report += `• Description: ${pendingPO.description}\n\n`;
    }

    report += `=====================================================\n`;
    report += `Confidential Executive Dispatch • Transmitted via KoraOps Autonomous Core`;

    return report;
  };

  const handleCopyReport = () => {
    const reportSummary = generateExecutiveReportText();
    navigator.clipboard.writeText(reportSummary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenEmailModal = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSent = (sentTo: string) => {
    setEmailNotificationToast(`Executive Summary dispatched to ${sentTo}`);
    setTimeout(() => setEmailNotificationToast(null), 4000);
  };

  // Web Speech API Voice Dictation
  const handleVoiceRecord = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      return;
    }

    if (!SpeechRecognition) {
      // Graceful fallback if Web Speech API isn't supported in user's browser environment
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Summarize supplier lead times and warehouse capacity');
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-NG' in recognition ? 'en-NG' : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setEmailNotificationToast('Microphone access not permitted. Check browser permissions.');
          setTimeout(() => setEmailNotificationToast(null), 3500);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsRecording(false);
      setInputText('Summarize supplier lead times and warehouse capacity');
    }
  };

  const isPoApproved = pendingPO.status === 'approved';

  return (
    <div className="flex flex-col w-full pb-36 max-w-screen-md mx-auto">
      {/* Top Orchestrator Status Band */}
      <section className="px-4 pt-3 pb-1">
        <div className="bg-surface-container-low rounded-xl p-3 shadow-sm flex flex-col gap-1 border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-[14px] text-on-surface">AI CEO Orchestrator</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[11px] font-semibold text-on-secondary-container">
                Autonomous Core Live
              </span>
            </div>
          </div>
          <p className="text-[12px] text-on-surface-variant flex items-center gap-1.5">
            <Network className="w-4 h-4 text-secondary" />
            Connected to 7 specialized sub-agents • Postgres Tool Layer Active
          </p>
        </div>
      </section>

      {/* Interactive Context Pill Bar */}
      <section className="px-4 py-1 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
          <button
            onClick={onOpenProfileModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-medium shadow-sm transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Mode: <strong className="font-bold">{executiveMode}</strong></span>
          </button>
          <button
            onClick={onOpenBranchModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-medium shadow-sm transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-secondary" />
            <span>Tenant: <strong className="font-bold">Balogun Mega Traders</strong></span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-[11px] font-medium shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>RBAC: <strong className="font-bold">Owner (Full Access)</strong></span>
          </div>
          <button
            id="email-summary-header-btn"
            onClick={handleOpenEmailModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary hover:bg-secondary/90 text-[11px] font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Email latest executive chat synthesis and telemetry to your email"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Executive Summary</span>
          </button>
        </div>
      </section>

      {/* Toast Notification */}
      {emailNotificationToast && (
        <div className="mx-4 mt-2 p-2.5 rounded-xl bg-secondary-container text-on-secondary-container border border-secondary/30 flex items-center gap-2 shadow-md animate-fade-in text-[12px] font-medium">
          <MailCheck className="w-4 h-4 text-secondary flex-shrink-0" />
          <span className="flex-1">{emailNotificationToast}</span>
          <button onClick={() => setEmailNotificationToast(null)} className="text-outline hover:text-on-surface">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Conversational Flow */}
      <div className="px-4 flex flex-col gap-4 mt-2">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end pl-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant">{msg.senderName}</span>
                  <span className="text-[11px] text-outline">{msg.timestamp}</span>
                </div>
                <div className="bg-primary text-on-primary rounded-2xl rounded-tr-none px-4 py-2.5 shadow-md max-w-xl">
                  <p className="text-[14px] text-on-primary leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          // AI Agent synthesized message
          return (
            <div key={msg.id} className="flex flex-col items-start pr-1">
              {/* Agent Header */}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed">
                  <Sparkles className="w-3.5 h-3.5 text-on-primary-container" />
                </div>
                <span className="font-semibold text-[14px] text-on-surface">{msg.senderName}</span>
                <span className="text-[11px] text-outline">{msg.timestamp}</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-semibold text-[10px]">
                  Multi-Agent Synthesis
                </span>
              </div>

              {/* Main Agent Container */}
              <div className="bg-surface-container-lowest rounded-2xl rounded-tl-none p-4 shadow-md flex flex-col gap-4 w-full border border-[#eaedff]">
                {/* Content text if generic message */}
                {msg.content && (
                  <p className="text-[14px] text-on-surface leading-relaxed">{msg.content}</p>
                )}

                {/* Operational Vitality Pillbox */}
                {msg.operationalVitality && (
                  <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-1 border border-[#eaedff]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                        Operational Vitality
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        <Activity className="w-3.5 h-3.5" />
                        Health {msg.operationalVitality.healthScore}/100
                      </div>
                    </div>
                    <p className="font-semibold text-[14px] text-on-surface leading-snug">
                      {msg.operationalVitality.headline}
                    </p>
                  </div>
                )}

                {/* Metric Highlight Bar Chart */}
                {msg.velocityMetric && (
                  <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-1 border border-[#eaedff]">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-on-surface-variant">{msg.velocityMetric.label}</span>
                      <span className="text-[12px] text-secondary font-bold">{msg.velocityMetric.changeText}</span>
                    </div>
                    <div className="w-full h-11 flex items-end gap-1.5 pt-1">
                      {msg.velocityMetric.bars.map((bar, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t transition-all ${
                            bar.isHighlight
                              ? idx === msg.velocityMetric!.bars.length - 1
                                ? 'bg-secondary'
                                : 'bg-secondary-fixed-dim'
                              : 'bg-surface-container-highest'
                          }`}
                          style={{ height: `${bar.heightPercent}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-outline text-[10px] pt-0.5">
                      <span>07:00</span>
                      <span>08:30</span>
                      <span>10:00</span>
                      <span>Current</span>
                    </div>
                  </div>
                )}

                {/* Sub-Agent Realtime Telemetry */}
                {msg.telemetryReports && msg.telemetryReports.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                      Sub-Agent Realtime Telemetry
                    </span>

                    {msg.telemetryReports.map((report) => {
                      if (report.agentType === 'finance') {
                        return (
                          <div key={report.id} className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-[#dae2fd]/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                                  <CreditCard className="w-3 h-3" />
                                </div>
                                <span className="text-[12px] font-bold text-on-surface">{report.agentName}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-semibold">
                                {report.badge}
                              </span>
                            </div>
                            <p className="text-[12px] text-on-surface mt-1 leading-relaxed">
                              <strong className="text-secondary font-semibold">₦4,850,200</strong> in gross receipts. 91% collected via instant NIBSS bank transfer & Paystack POS. OpEx today: <strong>₦320,000</strong> (diesel generator fueling & delivery logistics).
                            </p>
                          </div>
                        );
                      }

                      if (report.agentType === 'inventory') {
                        return (
                          <div key={report.id} className="bg-error-container rounded-xl p-3 flex flex-col gap-1 border border-error/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-on-error flex items-center justify-center text-error">
                                  <Package className="w-3 h-3 text-error" />
                                </div>
                                <span className="text-[12px] font-bold text-on-error-container">{report.agentName}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[10px] font-semibold">
                                {report.badge}
                              </span>
                            </div>
                            <p className="text-[12px] text-on-error-container mt-1 leading-relaxed">
                              Critical warning: Golden Penny Vegetable Oil (5L) stockout projected within <strong>14 hours</strong>. Supplier Lead time: 2 days.
                            </p>
                          </div>
                        );
                      }

                      if (report.agentType === 'sales') {
                        return (
                          <div key={report.id} className="bg-surface-container-high rounded-xl p-3 flex items-center justify-between gap-3 border border-[#dae2fd]/70">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-1 ring-secondary/30"
                                alt="Blessing O."
                                src={report.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB8XDITV4k_nQXwDkINIU9om1fvWJhOLOln9XXmjYHEyKqQU2VmyWYEs8oliyOZKlgKRNCQuD0BTiCSIR3m3TGyowxTCmVWL4YcWp1H6gLo8vBslG0FUFNuv9x07d7LpBDYroS8VSKszFOIOvDvIcdeyY2q1JgiMEhiwiDEima23WT2uy5VINWlwX-6tdh0ArJodGuW91XMUgyPnuJIH2hAGBWV-ApfzQwKGmKyjcJCbK3DX8zGmM2SkQ"}
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[12px] font-bold text-on-surface">{report.agentName}</span>
                                  <Award className="w-3.5 h-3.5 text-secondary" />
                                </div>
                                <p className="text-[12px] text-on-surface-variant truncate">
                                  Top rep: <strong className="text-on-surface">{report.repName || 'Blessing O.'}</strong> (₦1,920,000 closed today)
                                </p>
                              </div>
                            </div>
                            <span className="text-[12px] text-secondary font-bold flex-shrink-0">
                              {report.dealsCount || '38 Deals'}
                            </span>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

                {/* Human-in-the-Loop Actionable Authorization Card */}
                {msg.pendingAuthorization && (
                  <div
                    id="po-decision-card"
                    className={`rounded-xl p-3 flex flex-col gap-2.5 shadow-sm transition-all border ${
                      isPoApproved
                        ? 'bg-secondary-container/30 border-secondary/40'
                        : 'bg-surface-container-low border-[#eaedff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Gavel className="w-4 h-4 text-secondary" />
                        <span className="font-semibold text-[14px] text-on-surface">HITL Pending Authorization</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold">
                        Risk: {pendingPO.risk}
                      </span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-lg p-3 flex flex-col gap-1 border border-surface-container">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-on-surface-variant">Draft Purchase Order</span>
                        <span className="text-[11px] font-bold text-on-surface">{pendingPO.refCode}</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-[16px] font-semibold text-on-surface">{pendingPO.supplierOrClient}</span>
                        <span className="text-[20px] text-secondary font-bold">
                          ₦{pendingPO.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                        {pendingPO.description}
                      </p>
                    </div>

                    {/* Action Buttons or Confirmation Banner */}
                    {!isPoApproved ? (
                      <div className="flex items-center gap-2 pt-1" id="action-btn-group">
                        <button
                          onClick={() => onApprovePO(pendingPO.id)}
                          className="flex-1 py-2.5 px-3 rounded-lg bg-secondary text-on-secondary text-[14px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 hover:bg-secondary/90 transition-all cursor-pointer"
                        >
                          <Fingerprint className="w-4 h-4" />
                          <span>Authorize & Send PO</span>
                          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/20 text-[10px] font-mono">Biometric Guard</span>
                        </button>
                        <button
                          onClick={() => {
                            onModifyPO(pendingPO.id, 'Adjust PO #PO-2024-918 terms: change quantity to 80 units');
                            setInputText('Adjust PO #PO-2024-918 terms: change quantity to 80 units');
                          }}
                          className="py-2.5 px-3 rounded-lg bg-surface-container-highest text-on-surface text-[14px] font-medium active:scale-95 hover:bg-surface-container transition-all cursor-pointer"
                        >
                          Modify Terms
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-secondary-container text-on-secondary-container text-center text-[12px] font-semibold flex items-center justify-center gap-1.5 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        <span>PO {pendingPO.refCode} authorized and transmitted via NIBSS API.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Micro Feedback & SQL Inspector Links */}
                <div className="flex items-center justify-between pt-1 text-on-surface-variant text-[12px]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFeedbackGiven('up')}
                      aria-label="Helpful"
                      className={`p-1.5 rounded-full hover:bg-surface-container transition-colors ${
                        feedbackGiven === 'up' ? 'text-secondary bg-secondary-container/40' : ''
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setFeedbackGiven('down')}
                      aria-label="Not helpful"
                      className={`p-1.5 rounded-full hover:bg-surface-container transition-colors ${
                        feedbackGiven === 'down' ? 'text-error bg-error-container/40' : ''
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopyReport}
                      aria-label="Copy report"
                      className="p-1.5 rounded-full hover:bg-surface-container transition-colors"
                      title="Copy operational brief"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-secondary" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isCopied && <span className="text-[10px] text-secondary font-medium">Copied!</span>}
                    <button
                      onClick={handleOpenEmailModal}
                      aria-label="Email Executive Summary"
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/10 hover:bg-secondary/20 text-secondary text-[11px] font-semibold transition-colors active:scale-95 cursor-pointer ml-1"
                      title="Email this executive summary & telemetry report"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Summary</span>
                    </button>
                  </div>
                  <button
                    onClick={onOpenSqlModal}
                    className="text-[11px] font-semibold text-secondary flex items-center gap-0.5 hover:underline"
                  >
                    <span>View {sqlQueriesCount} SQL queries</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 text-on-surface-variant text-[12px] pl-2 py-1">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
            <span>Synthesizing multi-agent operational telemetry...</span>
          </div>
        )}

        {/* Suggested Follow-Up Prompt Chips */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Proactive Strategic Probes
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Which customers owe past 30 days?',
              'Calculate gross margin on cosmetics line',
              'Forecast weekend cashflow'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[12px] active:scale-95 transition-all text-left shadow-sm border border-[#eaedff]"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Docked Command Bar (Fixed above bottom nav) */}
      <div className="fixed bottom-16 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl px-4 py-2 shadow-lg border-t border-[#eaedff]">
        <div className="max-w-screen-md mx-auto flex flex-col gap-1.5">
          {/* Top Micro Utility Row: WhatsApp Mirror Toggle */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={onToggleWhatsApp}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <MessageSquare className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] text-on-surface font-medium">WhatsApp Mirror</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isWhatsAppActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {isWhatsAppActive ? 'ON' : 'OFF'}
              </span>
            </button>
            <span className="text-[11px] text-outline">Voice & Text Bi-directional Sync</span>
          </div>

          {/* Main Input Bar */}
          <div className="flex items-center gap-1.5 bg-surface-container-low rounded-2xl p-1 shadow-sm border border-surface-container">
            <button
              onClick={handleVoiceRecord}
              aria-label="Dictate message using Web Speech API"
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-all ${
                isRecording
                  ? 'bg-error text-white animate-pulse'
                  : 'bg-surface-container-highest hover:bg-surface-container text-on-surface'
              }`}
              title={isRecording ? 'Listening via Web Speech API... click to stop' : 'Start voice dictation'}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-white animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent py-2 px-2 text-[14px] text-on-surface placeholder:text-outline focus:outline-none min-w-0"
              id="ceo-prompt-input"
              placeholder={isRecording ? 'Listening (speak now)...' : 'Ask KoraOps anything about your business...'}
              type="text"
            />

            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Email Executive Summary Modal */}
      <EmailSummaryModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultEmail={userEmail}
        subject={`[Executive Brief] KoraOps AI CEO Operational Telemetry - Balogun Mega Traders`}
        summaryText={generateExecutiveReportText()}
        onSent={handleEmailSent}
      />
    </div>
  );
};
