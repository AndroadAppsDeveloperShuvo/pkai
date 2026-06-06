import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function PermissionModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#0d0e12] border border-red-500/15 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Soft atmospheric red glow */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500/40 animate-pulse" />
        
        {/* Modern Glassmorphic Alert Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <ShieldAlert size={26} className="text-red-400" />
        </div>
        
        <h2 className="text-lg font-bold text-white mb-2 tracking-wide">
          Microphone Access Required
        </h2>
        <p className="text-slate-400 text-xs mb-5 leading-relaxed px-2">
          To converse with PK using real-time vocal streams, microphone permission needs to be granted in your browser.
        </p>
        
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left w-full mb-6">
          <p className="text-xs text-red-400 font-bold mb-2 uppercase tracking-wider">How to resolve:</p>
          <ol className="text-xs text-slate-300 list-decimal pl-4.5 space-y-2.5">
            <li>Click the lock icon <strong className="text-white">🔒</strong> near your browser's address bar.</li>
            <li>Change the <strong className="text-white">Microphone</strong> setting to <span className="text-emerald-400 font-semibold">"Allow"</span>.</li>
            <li>Reload the page to connect the stream.</li>
          </ol>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full gap-3">
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-400 text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/10"
          >
            <RefreshCw size={12} className="animate-spin" />
            Reload Page
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs border border-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
