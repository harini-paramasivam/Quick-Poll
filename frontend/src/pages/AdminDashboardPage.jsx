import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/apiClient';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';

function AdminDashboardPage() {
  const { adminToken } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('info');

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!dashboard) {
    return <Notification message={message || 'Dashboard unavailable.'} status="error" />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Creator dashboard</h1>
        <p className="text-slate-400">Monitor poll results and close voting when you are ready.</p>
      </div>

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
            {message && <Notification message={message} status={status} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={handleClose} disabled={dashboard.isClosed || submitting} variant="danger">
                {dashboard.isClosed ? 'Poll closed' : submitting ? 'Closing...' : 'Close poll'}
              </Button>
              <Link className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500" to={`/poll/${dashboard.pollId}`}>
                Open poll link
              </Link>
              <Link className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500" to={`/poll/${dashboard.pollId}/results`}>
                View live results
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
