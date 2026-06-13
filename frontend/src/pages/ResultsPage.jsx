import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api/apiClient';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';
import Button from '../components/Button';

const colors = ['#4f46e5', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444'];

function ResultsPage() {
  const { pollId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/polls/${pollId}/results`);
        setResults(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [pollId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!results) {
    return <Notification message={message || 'Poll results unavailable.'} status="error" />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Results</h1>
        <p className="text-slate-400">See how each option performed and the current vote distribution.</p>
      </div>
      <Card>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">{results.title}</h2>
            <p className="mt-2 text-sm text-slate-400">Total votes: {results.totalVotes}</p>
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
            {results.options.map((option, index) => (
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
      <div className="flex flex-wrap gap-3">
        <Link to={`/poll/${pollId}`}>
          <Button variant="secondary">Back to vote</Button>
        </Link>
      </div>
    </div>
  );
}

export default ResultsPage;
