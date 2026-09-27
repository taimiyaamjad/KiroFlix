import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, Cloud, Zap } from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const schemaSql = `-- Animo Optimized Database Schema for Fast Load Times
-- Indexes tailored for <15ms cold queries and real-time streaming

CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY, -- Clerk User ID (e.g. user_2b9x...)
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  preferred_audio VARCHAR(10) DEFAULT 'ja',
  preferred_quality VARCHAR(10) DEFAULT '1080p',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE anime_series (
  id VARCHAR(64) PRIMARY KEY, -- Crunchyroll ID (e.g. GDKHZEJ0K)
  title VARCHAR(255) NOT NULL,
  japanese_title VARCHAR(255),
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  banner_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 0.0,
  year INTEGER NOT NULL,
  status VARCHAR(32) NOT NULL,
  total_episodes INTEGER NOT NULL,
  genres TEXT[] NOT NULL,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Fast GIN index for full-text search matching GET /api/search?q=...
CREATE INDEX idx_anime_search ON anime_series USING GIN(search_vector);
CREATE INDEX idx_anime_rating ON anime_series (rating DESC);

CREATE TABLE episodes (
  id VARCHAR(64) PRIMARY KEY,
  series_id VARCHAR(64) REFERENCES anime_series(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  season_number INTEGER DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration INTEGER NOT NULL,
  stream_url TEXT NOT NULL,
  crunchyroll_url TEXT NOT NULL,
  intro_start INTEGER,
  intro_end INTEGER,
  outro_start INTEGER,
  outro_end INTEGER
);

CREATE INDEX idx_episodes_series ON episodes (series_id, season_number, episode_number);

CREATE TABLE watch_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  series_id VARCHAR(64) REFERENCES anime_series(id) ON DELETE CASCADE,
  episode_id VARCHAR(64) REFERENCES episodes(id) ON DELETE CASCADE,
  current_time INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_user_series_episode UNIQUE(user_id, series_id, episode_id)
);

CREATE INDEX idx_progress_latest ON watch_progress (user_id, last_watched_at DESC);`;

  const vercelJson = `{
  "framework": "nextjs",
  "buildCommand": "next build",
  "regions": ["iad1", "sfo1", "sin1"],
  "env": {
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@clerk_publishable_key",
    "CLERK_SECRET_KEY": "@clerk_secret_key",
    "DATABASE_URL": "@database_url",
    "CRUNCHYROLL_API_BASE": "@crunchyroll_api_base"
  }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0D1017] border border-[#222736] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        <div className="p-5 border-b border-[#1A1F2D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-bold text-white text-base">Next.js & Vercel Deployment Blueprint</h3>
              <p className="text-xs text-neutral-400">Optimized Database Schema & Cloud Hosting</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#121622] rounded-xl border border-[#1E2436]">
              <Zap className="w-4 h-4 text-amber-400 mb-1" />
              <h4 className="text-xs font-semibold text-white">Fast Cold Starts</h4>
              <p className="text-[11px] text-neutral-400">Sub-15ms cached lookups with GIN tsvector indexing.</p>
            </div>
            <div className="p-3 bg-[#121622] rounded-xl border border-[#1E2436]">
              <Database className="w-4 h-4 text-emerald-400 mb-1" />
              <h4 className="text-xs font-semibold text-white">PostgreSQL / Neon / Supabase</h4>
              <p className="text-[11px] text-neutral-400">Normalized watch progress & Clerk user relations.</p>
            </div>
            <div className="p-3 bg-[#121622] rounded-xl border border-[#1E2436]">
              <Cloud className="w-4 h-4 text-blue-400 mb-1" />
              <h4 className="text-xs font-semibold text-white">Vercel Edge Streaming</h4>
              <p className="text-[11px] text-neutral-400">Server-Sent Events for progressive metadata delivery.</p>
            </div>
          </div>

          {/* Database Schema */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Optimized Database Schema (schema.sql)
              </span>
              <button
                onClick={() => copyToClipboard(schemaSql, 'sql')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <div className="bg-[#08090C] p-4 rounded-xl border border-[#1A1F2D] font-mono text-[11px] text-neutral-300 max-h-56 overflow-y-auto">
              <pre>{schemaSql}</pre>
            </div>
          </div>

          {/* vercel.json */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                Vercel Configuration (vercel.json)
              </span>
              <button
                onClick={() => copyToClipboard(vercelJson, 'json')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'json' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <div className="bg-[#08090C] p-4 rounded-xl border border-[#1A1F2D] font-mono text-[11px] text-neutral-300">
              <pre>{vercelJson}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
