import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import QRCode from 'react-qr-code';
import api from '../api/apiClient';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';
import Button from '../components/Button';

const colors = ['#4f46e5', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444'];

function ResultsPage() {
  const navigate = useNavigate();
  const { pollId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('info');

  const shareUrl = useMemo(() => `${window.location.origin}/poll/${pollId}`, [pollId]);

  const fetchResults = async () => {
    try {
      const response = await api.get(`/api/polls/${pollId}/results`);
      setResults(response.data);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Unable to load results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchResults();
    const interval = setInterval(fetchResults, 2500);
    return () => clearInterval(interval);
  }, [pollId]);

  const handleCopyLink = async () => {
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

  if (!results) {
    return <Notification message={message || 'Poll results unavailable.'} status="error" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-white">Results</h1>
          <p className="text-slate-400">See how each option performed and the current vote distribution.</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {message && <Notification message={message} status={status} />}

      <Card>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">{results.title}</h2>
            <p className="mt-2 text-sm text-slate-400">Total votes: {results.totalVotes}</p>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Share this poll</p>
                <p className="mt-1 text-sm text-slate-300">Use the link or scan the QR code to share with voters.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={handleCopyLink} variant="secondary">
                  Copy share link
                </Button>
                <Link to={`/poll/${pollId}`}>
                  <Button variant="secondary">Open poll</Button>
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

          <div className="h-72 rounded-3xl bg-slate-950/90 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.options} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <XAxis dataKey="label" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }} />
                <Bar dataKey="votes" radius={[12, 12, 0, 0]}>
                  {results.options.map((entry, index) => (
                    <Cell key={entry.id} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {results.options.map((option) => (
              <div key={option.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-slate-400">{option.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{option.votes}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {option.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ResultsPage;
