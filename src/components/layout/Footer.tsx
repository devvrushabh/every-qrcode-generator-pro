import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ShieldCheck, Zap, Globe, Share2, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6451F8] to-indigo-500 flex items-center justify-center text-white shadow-md shadow-[#6451F8]/20">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">Every QRCode Generator Pro</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The enterprise-grade QR code platform to generate, customize, track, and optimize static & dynamic QR codes for modern brands worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/generator" className="hover:text-white transition-colors">QR Generator</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">Dynamic QR Codes</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/generator" className="hover:text-white transition-colors">vCard Generator</Link>
              </li>
              <li>
                <Link to="/generator" className="hover:text-white transition-colors">Wi-Fi QR Codes</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">Scan Analytics</Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FAQ & Support</a>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider">Legal & Security</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-2">
                <ShieldCheck className="w-4 h-4" /> GDPR & CCPA Compliant
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Every QRCode Generator Pro, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-brand-400" /> 99.99% Uptime SLA</span>
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-400" /> Global CDN Redirects</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
