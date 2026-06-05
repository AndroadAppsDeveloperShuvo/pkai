import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, RefreshCw, ExternalLink } from 'lucide-react';

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
          মোবাইল বা কম্পিউটারের ব্রাউজারের সিকিউরিটি পলিসির জন্য <strong className="text-pink-400">Google AI Studio iFrame Container</strong> এর ভেতরে সরাসরি মাইক্রোফোন পপআপ ব্লক হয়ে থাকতে পারে।
        </p>
        
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left w-full mb-6">
          <p className="text-xs text-red-400 font-bold mb-2 uppercase tracking-wider">How to resolve (সমাধান):</p>
          <ul className="text-xs text-slate-300 list-disc pl-4.5 space-y-2.5">
            <li>নিচের <strong className="text-emerald-400">"Open in New Tab"</strong> বাটনে ক্লিক করে ওয়েবসাইটটি নতুন ট্যাবে ওপেন করুন।</li>
            <li>সেখানে <strong className="text-white">"Interact with PK"</strong>-এ ক্লিক করলেই ব্রাউজার সাথে সাথেই মাইক্রোফোনের <strong className="text-emerald-400">Allow</strong> পপআপ দেখাবে!</li>
            <li>অথবা ব্রাউজারের সার্চ বারের পাশে লক আইকন <strong className="text-white">🔒</strong> এ ক্লিক করে মাইক্রোফোন "Allow" করতে পারেন।</li>
          </ul>
        </div>
        
        <div className="flex flex-col w-full gap-2.5">
          <a 
            href={window.location.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/10 hover:shadow-pink-500/25"
          >
            <ExternalLink size={13} />
            Open in New Tab (নতুন ট্যাবে ওপেন করুন)
          </a>
          
          <div className="flex gap-2.5 w-full">
            <button 
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs border border-white/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={11} />
              Reload Page
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-300 font-semibold rounded-xl text-xs border border-white/5 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
