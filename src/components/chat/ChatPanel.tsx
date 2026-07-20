'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { motion, useReducedMotion } from 'framer-motion';
import { MONO, SERIF, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import { site } from '@/lib/data/site';

const SUGGESTED = [
  'What is Toledo Football IQ?',
  'Tell me about the UAV research',
  "What's Ahmad building right now?",
  'Is Ahmad available for work?',
];

const FALLBACK_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is Toledo Football IQ?',
    a: 'Ahmad\'s flagship build for University of Toledo Athletics: a 10-stage computer vision pipeline that turns practice film into evidence a coach can verify, correct, and teach from — 18+ structured metrics, 90%+ field-marking accuracy targets, and a coach-correction flywheel.',
  },
  {
    q: 'What does Ahmad work with?',
    a: 'Agentic AI and enterprise systems (Oracle Cloud, Copilot Studio), reinforcement learning for UAV autonomy (PyTorch, ROS 2), MLOps (Airflow, MLflow), computer vision (YOLO, ByteTrack), and edge web stacks (Cloudflare Workers, React).',
  },
  {
    q: 'Is Ahmad available?',
    a: `He's based in Toledo, OH and open to AI research, ML engineering, data science, and sports analytics work — the fastest route is ${site.email}.`,
  },
];

/**
 * The Ask Ahmad panel: streaming chat when a provider key is configured;
 * a graceful "warming up" state with canned FAQ + mailto when it is not.
 */
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const reduced = useReducedMotion();
  const [input, setInput] = useState('');
  const [unconfigured, setUnconfigured] = useState(false);
  const [limited, setLimited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: async (err) => {
      const msg = String(err?.message ?? '');
      if (msg.includes('not-configured') || msg.includes('503')) setUnconfigured(true);
      else if (msg.includes('rate-limited') || msg.includes('429')) setLimited(true);
    },
  });

  const busy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, busy, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || busy || unconfigured) return;
    setLimited(false);
    sendMessage({ text: t.slice(0, 500) });
    setInput('');
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Ask Ahmad — AI assistant"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      style={{
        position: 'fixed',
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
        right: 20,
        zIndex: 9600,
        width: 'min(390px, calc(100vw - 32px))',
        height: 'min(560px, calc(100svh - 110px))',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(15,17,23,0.98)',
        border: '1px solid rgba(45,212,191,0.3)',
        borderRadius: 14,
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 40px -20px rgba(45,212,191,0.3)',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--bd)', background: 'rgba(45,212,191,0.05)' }}>
        <span aria-hidden style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, var(--primary), #0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 15, color: '#06211e', fontWeight: 600 }}>AF</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: 'var(--foreground)' }}>Ask Ahmad</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            AI · answers from his portfolio
          </div>
        </div>
        <button onClick={onClose} aria-label="Close chat" style={{ background: 'none', border: '1px solid var(--bd2)', borderRadius: 7, width: 30, height: 30, color: FG2, cursor: 'pointer', fontSize: 13 }}>✕</button>
      </div>

      {/* messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {unconfigured ? (
          <Fallback />
        ) : (
          <>
            {messages.length === 0 && (
              <div>
                <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.65, color: FG2, margin: '4px 0 14px' }}>
                  Hi — I&apos;m the AI on Ahmad&apos;s site. I can walk you through his projects, research, stack, and availability. What would you like to know?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {SUGGESTED.map((s) => (
                    <button key={s} onClick={() => submit(s)} style={{ textAlign: 'left', fontFamily: MONO, fontSize: 11, letterSpacing: '0.02em', color: 'var(--primary)', background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.22)', borderRadius: 8, padding: '9px 13px', cursor: 'pointer' }}>
                      {s} →
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '86%' }}>
                <div style={{
                  fontFamily: SANS, fontSize: 13.5, lineHeight: 1.62, whiteSpace: 'pre-wrap',
                  color: m.role === 'user' ? '#06211e' : 'var(--foreground)',
                  background: m.role === 'user' ? 'var(--primary)' : 'rgba(244,244,242,0.05)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--bd)',
                  borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  padding: '10px 13px',
                }}>
                  {m.parts.filter((p) => p.type === 'text').map((p, i) => <Rich key={i} text={(p as { text: string }).text} />)}
                </div>
              </div>
            ))}

            {busy && (
              <div aria-live="polite" style={{ alignSelf: 'flex-start', fontFamily: MONO, fontSize: 11, color: FG3, display: 'flex', gap: 5, alignItems: 'center', padding: '4px 2px' }}>
                <span className="chat-dot" /><span className="chat-dot" style={{ animationDelay: '0.18s' }} /><span className="chat-dot" style={{ animationDelay: '0.36s' }} />
              </div>
            )}

            {limited && (
              <p style={{ fontFamily: MONO, fontSize: 10.5, color: 'var(--gold)', lineHeight: 1.6, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, padding: '9px 12px' }}>
                Easy there — that&apos;s the rate limit. Give it a few minutes, or just email {site.email}.
              </p>
            )}
            {error && !limited && !unconfigured && (
              <p style={{ fontFamily: MONO, fontSize: 10.5, color: 'var(--red)', lineHeight: 1.6 }}>
                Something hiccuped. Try again, or email {site.email}.
              </p>
            )}
          </>
        )}
      </div>

      {/* composer */}
      {!unconfigured && (
        <form
          onSubmit={(e) => { e.preventDefault(); submit(input); }}
          style={{ display: 'flex', gap: 8, padding: '12px 14px', borderTop: '1px solid var(--bd)' }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            placeholder="Ask about projects, research, availability…"
            aria-label="Message"
            style={{ flex: 1, background: 'rgba(244,244,242,0.04)', border: '1px solid var(--bd2)', borderRadius: 8, padding: '10px 13px', fontFamily: SANS, fontSize: 13, color: 'var(--foreground)', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            style={{ background: busy || !input.trim() ? 'rgba(45,212,191,0.25)' : 'var(--primary)', color: '#06211e', border: 'none', borderRadius: 8, width: 42, cursor: busy ? 'wait' : 'pointer', fontSize: 15, fontWeight: 700 }}
          >↑</button>
        </form>
      )}

      <style>{`
        .chat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); display: inline-block; animation: chat-bounce 1s ease-in-out infinite; }
        @keyframes chat-bounce { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
      `}</style>
    </motion.div>
  );
}

/** Minimal rich text: **bold** only; everything else stays literal. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>
      )}
    </>
  );
}

function Fallback() {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.06)', borderRadius: 6, padding: '6px 10px', display: 'inline-block' }}>
        Assistant warming up — live answers soon
      </div>
      <p style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.65, color: FG2, margin: '12px 0 14px' }}>
        The live AI isn&apos;t wired up yet. Meanwhile, the greatest hits:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FALLBACK_FAQ.map((f) => (
          <div key={f.q} style={{ border: '1px solid var(--bd)', borderRadius: 8, padding: '11px 13px', background: 'rgba(244,244,242,0.02)' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--primary)', marginBottom: 5 }}>{f.q}</div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.6, color: FG2 }}>{f.a}</div>
          </div>
        ))}
      </div>
      <a href={`mailto:${site.email}`} style={{ display: 'inline-flex', marginTop: 14, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#06211e', background: 'var(--primary)', borderRadius: 6, padding: '9px 16px', fontWeight: 700 }}>
        Email Ahmad instead ↗
      </a>
    </div>
  );
}
