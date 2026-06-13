import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import api from '../api/apiClient';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { adminToken } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('info');

  const shareUrl = useMemo(() => (dashboard ? `${window.location.origin}/poll/${dashboard.pollId}` : ''), [dashboard]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/manage/${adminToken}`);
        setDashboard(response.data);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Unable to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [adminToken]);

  const handleClose = async () => {
    if (!dashboard || dashboard.isClosed) return;
    setSubmitting(true);
    setMessage(null);

    try {
      await api.patch(`/api/manage/${adminToken}/close`);
      setStatus('success');
      setMessage('Poll closed successfully.');
      setDashboard((current) => ({ ...current, isClosed: true }));
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Unable to close poll.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('success');
      setMessage('Poll link copied to clipboard.');
    } catch (error) {
      setStatus('error');
      setMessage('Unable to copy the poll link.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!dashboard) {
    return <Notification message={message || 'Dashboard unavailable.'} status="error" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-white">Creator dashboard</h1>
          <p className="text-slate-400">Monitor poll results and close voting when you are ready.</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {message && <Notification message={message} status={status} />}

      <Card>
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Question</p>
              <h2 className="text-xl font-semibold text-white">{dashboard.title}</h2>
            </div>
            <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Status</p>
              <span className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold ${dashboard.isClosed ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-slate-950'}`}>
                {dashboard.isClosed ? 'Closed' : 'Open'}
              </span>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Share this poll</p>
                <p className="mt-1 text-sm text-slate-300">Use the link or QR code to share with voters.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={handleCopyLink} variant="secondary">
                  Copy share link
                </Button>
                <Link to={`/poll/${dashboard.pollId}`}>
                  <Button variant="secondary">Open poll link</Button>
                </Link>
                <Link to={`/poll/${dashboard.pollId}/results`}>
                  <Button variant="secondary">View results</Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:flex-row sm:justify-between">
              <div className="break-all text-sm text-slate-200">{shareUrl}</div>
              <div className="rounded-3xl bg-white/5 p-4">
                <QRCode value={shareUrl} size={128} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Results</p>
            <div className="mt-4 space-y-4">
              {dashboard.options.map((option) => (
                <div key={option.id} className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">{option.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{option.votes} votes</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                      {option.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleClose} disabled={dashboard.isClosed || submitting} variant="danger">
              {dashboard.isClosed ? 'Poll closed' : submitting ? 'Closing...' : 'Close poll'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
