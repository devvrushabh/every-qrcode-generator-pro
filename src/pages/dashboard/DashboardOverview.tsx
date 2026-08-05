import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQRCodes } from '../../hooks/useQRCodes';
import { useFolders } from '../../hooks/useFolders';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  QrCode,
  Folder,
  Layers,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { allQRCodes, loading: qrLoading } = useQRCodes();
  const { folders, loading: folderLoading } = useFolders();

  const staticQRCount = allQRCodes.filter((q) => q.mode === 'static').length;
  const recentQRCodes = allQRCodes.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#6451F8] to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#6451F8]/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Account Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Creator'}!
          </h1>
          <p className="text-slate-100 text-xs sm:text-sm max-w-xl">
            Manage your saved QR codes, organize folders, and export crisp vector codes.
          </p>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="shrink-0 bg-white text-slate-900 hover:bg-slate-100 font-bold"
          leftIcon={<Plus className="w-4 h-4 text-[#6451F8]" />}
          onClick={() => navigate('/dashboard/qr-codes/new')}
        >
          Create New QR Code
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total QR Codes</span>
            <div className="w-10 h-10 rounded-2xl bg-[#6451F8]/10 text-[#6451F8] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {qrLoading ? '...' : allQRCodes.length}
          </p>
          <p className="text-[11px] text-slate-500">Real Supabase database records</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Static QR Codes</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {qrLoading ? '...' : staticQRCount}
          </p>
          <p className="text-[11px] text-slate-500">Permanent client-side scannables</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Folders</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {folderLoading ? '...' : folders.length}
          </p>
          <p className="text-[11px] text-slate-500">Organized campaign categories</p>
        </Card>
      </div>

      {/* Recent QR Codes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#6451F8]" /> Recent QR Codes
          </h3>
          {allQRCodes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/qr-codes')}
            >
              View All ({allQRCodes.length})
            </Button>
          )}
        </div>

        {qrLoading ? (
          <Card className="p-12 text-center text-slate-400 text-sm animate-pulse">
            Loading database records...
          </Card>
        ) : recentQRCodes.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">No QR codes yet.</h4>
              <p className="text-xs text-slate-500">Create your first QR code and save it to your account here.</p>
            </div>
            <Button
              variant="gradient"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/qr-codes/new')}
            >
              Create QR Code
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentQRCodes.map((qr) => (
              <Card key={qr.id} hoverable className="p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#6451F8]/10 text-[#6451F8] dark:bg-brand-950 dark:text-brand-300">
                      {qr.type}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(qr.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{qr.name}</h4>
                  <p className="text-xs text-slate-500 font-mono truncate">{qr.payload}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/dashboard/qr-codes/${qr.id}`)}
                  >
                    Open Editor
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
