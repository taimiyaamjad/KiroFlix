import React, { useState, useEffect } from 'react';
import { Server, Activity, Download, CheckCircle, AlertTriangle, X, Play, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { ApiConfig } from '../types/auth';
import { HealthApiResponse } from '../types/anime';

interface ApiExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onConfigChange: (newConfig: Partial<ApiConfig>) => void;
}

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange
}) => {
  const [healthData, setHealthData] = useState<HealthApiResponse | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(config.customBaseUrl);
  const [downloadTestUrl, setDownloadTestUrl] = useState(
    'https://www.crunchyroll.com/watch/GR3K0XK9R/iruma-kun-from-demon-school'
  );
  const [downloadResult, setDownloadResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'health' | 'download_test' | 'widevine_help'>('endpoints');

  useEffect(() => {
    if (isOpen) {
      pingHealth();
    }
  }, [isOpen, config.mode, config.customBaseUrl]);

  const pingHealth = async () => {
    setIsPinging(true);
    try {
      const data = await apiClient.getHealth();
      setHealthData(data);
    } catch {
      setHealthData(null);
    } finally {
      setIsPinging(false);
    }
  };

  const handleSaveCustomUrl = () => {
    onConfigChange({
      customBaseUrl: customUrlInput.trim(),
      mode: 'custom'
    });
  };

  const runDownloadTest = async () => {
    setIsDownloading(true);
    setDownloadResult(null);
    try {
      const res = await apiClient.getDownloadJob(downloadTestUrl, 'en', '1080p');
      setDownloadResult(res);
    } catch (err: any) {
      setDownloadResult({ error: err.message });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0D1017] border border-[#222736] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1A1F2D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-bold text-white text-base font-display">Crunchyroll API Connector</h3>
              <p className="text-xs text-neutral-400">
                Service: <code className="text-neutral-300">crunchyroll-downloader-api</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Switcher banner */}
        <div className="px-5 py-3 bg-[#11141E] border-b border-[#1A1F2D] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Target Server:</span>
            <div className="flex items-center gap-1 bg-[#0A0C11] p-1 rounded-lg border border-[#202636]">
              <button
                onClick={() => onConfigChange({ mode: 'internal' })}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  config.mode === 'internal'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Built-in Cloud (Ultra Fast)
              </button>
              <button
                onClick={() => onConfigChange({ mode: 'custom' })}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  config.mode === 'custom'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Codespace / Local Port 8080
              </button>
            </div>
          </div>

          {/* Quick Health Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Health:</span>
            {healthData && healthData.status === 'ok' ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                OK ({healthData.uptime_seconds}s uptime)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Offline / Internal fallback
              </span>
            )}
            <button
              onClick={pingHealth}
              disabled={isPinging}
              className="p-1 text-neutral-400 hover:text-white"
              title="Refresh Health"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Custom Server URL configuration input */}
        {config.mode === 'custom' && (
          <div className="p-4 bg-[#141824] border-b border-[#1A1F2D] flex flex-wrap items-center gap-2">
            <label className="text-xs text-neutral-300 font-medium">Endpoint Base URL:</label>
            <input
              type="text"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="e.g. https://scaling-waddle-7vwpg5w75gq7fgg7-8080.app.github.dev"
              className="flex-1 min-w-[280px] bg-[#0A0C11] border border-[#222736] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-red-500"
            />
            <button
              onClick={handleSaveCustomUrl}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Save & Test
            </button>
          </div>
        )}

        {/* Nav Tabs */}
        <div className="flex items-center border-b border-[#1A1F2D] px-5 bg-[#0D1017] text-xs font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'endpoints'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            API Endpoints & Schema
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'health'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            /api/health Inspector
          </button>
          <button
            onClick={() => setActiveTab('download_test')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'download_test'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            /api/download Tester
          </button>
          <button
            onClick={() => setActiveTab('widevine_help')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'widevine_help'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Widevine DRM Fix Guide
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <div className="bg-[#08090C] p-4 rounded-xl border border-[#1A1F2D] font-mono text-xs text-neutral-300">
                <p className="text-red-400 font-bold mb-2">// API Manifest</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-blue-400 font-semibold">GET</span>{' '}
                    <span className="text-white">/api/search?q=&lt;query&gt;&limit=10</span>
                    <p className="text-neutral-500 text-[11px] font-sans mt-0.5">
                      Returns count, query, and an array of series results with crunchyroll series URLs and high-res thumbnails.
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-400 font-semibold">GET</span>{' '}
                    <span className="text-white">/api/download?url=&lt;episode_url&gt;&language=en&quality=1080p</span>
                    <p className="text-neutral-500 text-[11px] font-sans mt-0.5">
                      Streams the downloaded video body or returns a JSON job descriptor when <code>format=json</code>.
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-400 font-semibold">GET</span>{' '}
                    <span className="text-white">/api/file/&lt;job_id&gt;</span>
                    <p className="text-neutral-500 text-[11px] font-sans mt-0.5">
                      Direct streaming media endpoint for finished job files.
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-400 font-semibold">GET</span>{' '}
                    <span className="text-white">/api/health</span>
                    <p className="text-neutral-500 text-[11px] font-sans mt-0.5">
                      Returns active job counts, cleanup interval (600s), and daemon uptime.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#121622] rounded-xl border border-[#1A1F2D] text-xs text-neutral-300 space-y-1.5">
                <span className="font-semibold text-white">Supported Stream Parameters:</span>
                <p>• <strong>language</strong>: Accepts full locale (<code>en-US</code>, <code>ja-JP</code>) or bare code (<code>en</code>, <code>ja</code>, <code>es</code>).</p>
                <p>• <strong>quality</strong>: <code>1080p</code>, <code>720p</code>, <code>480p</code>, <code>360p</code>.</p>
                <p>• <strong>auth override</strong>: pass <code>etp_rt=...</code> cookie to bypass guest limits.</p>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="bg-[#08090C] p-4 rounded-xl border border-[#1A1F2D] font-mono text-xs text-emerald-400">
                <pre>{JSON.stringify(healthData, null, 2)}</pre>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#121622] p-3 rounded-lg border border-[#1A1F2D]">
                  <span className="text-neutral-500 text-[11px] block">Active Jobs</span>
                  <span className="text-lg font-bold text-white font-mono-numbers">
                    {healthData?.active_jobs ?? 0}
                  </span>
                </div>
                <div className="bg-[#121622] p-3 rounded-lg border border-[#1A1F2D]">
                  <span className="text-neutral-500 text-[11px] block">Cleanup Window</span>
                  <span className="text-lg font-bold text-white font-mono-numbers">
                    {healthData?.cleanup_seconds ?? 600}s
                  </span>
                </div>
                <div className="bg-[#121622] p-3 rounded-lg border border-[#1A1F2D]">
                  <span className="text-neutral-500 text-[11px] block">Tracked Files</span>
                  <span className="text-lg font-bold text-white font-mono-numbers">
                    {healthData?.tracked_files ?? 0}
                  </span>
                </div>
                <div className="bg-[#121622] p-3 rounded-lg border border-[#1A1F2D]">
                  <span className="text-neutral-500 text-[11px] block">Uptime</span>
                  <span className="text-lg font-bold text-white font-mono-numbers">
                    {healthData?.uptime_seconds ?? 0}s
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'download_test' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral-300 font-medium">Crunchyroll Watch URL to test:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={downloadTestUrl}
                    onChange={(e) => setDownloadTestUrl(e.target.value)}
                    className="flex-1 bg-[#08090C] border border-[#222736] rounded px-3 py-2 text-xs text-white font-mono outline-none"
                  />
                  <button
                    onClick={runDownloadTest}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                  >
                    {isDownloading ? 'Testing...' : 'Execute Request'}
                  </button>
                </div>
              </div>

              {downloadResult && (
                <div className="bg-[#08090C] p-4 rounded-xl border border-[#1A1F2D] font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{JSON.stringify(downloadResult, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'widevine_help' && (
            <div className="space-y-4 text-xs text-neutral-300">
              <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm mb-1 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Fixing the "No Widevine Device Provided" Error</span>
                </div>
                <p>
                  In your screenshot, Crunchyroll's DRM threw:
                  <br />
                  <code className="text-amber-300 font-mono text-[11px] mt-1 block bg-black/40 p-2 rounded">
                    error: download failed: getLicense for en-US: no widevine device provided. You either need: a ".wvd" file, or "client_id.bin"
                  </code>
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-[#121622] p-3.5 rounded-lg border border-[#1A1F2D]">
                  <h4 className="font-semibold text-white mb-1">Option 1: Use Animo Direct Stream Cloud (Recommended)</h4>
                  <p className="text-neutral-400">
                    Switch the Target Server toggle above to <strong>"Built-in Cloud (Ultra Fast)"</strong>. Animo automatically provisions DRM-free master streams and trailers for instant high-definition playback directly in your browser.
                  </p>
                </div>

                <div className="bg-[#121622] p-3.5 rounded-lg border border-[#1A1F2D]">
                  <h4 className="font-semibold text-white mb-1">Option 2: Supply CDM to your Downloader Server</h4>
                  <p className="text-neutral-400 mb-2">
                    If you are hosting <code>crunchyroll-downloader-api</code> on GitHub Codespaces or your VPS:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-300 font-mono text-[11px]">
                    <li>Place a valid <code>device.wvd</code> into your server directory (e.g. <code>./cdms/device.wvd</code>).</li>
                    <li>Set the environment variable: <code>WIDEVINE_DEVICE_PATH=./cdms/device.wvd</code></li>
                    <li>Restart the Go/Python/Node service daemon.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
