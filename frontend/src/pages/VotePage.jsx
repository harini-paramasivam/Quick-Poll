import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/apiClient';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';

function VotePage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('info');

  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/polls/${pollId}`);
        setPoll(response.data);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Unable to load poll.');
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [pollId]);

  const handleVote = async (event) => {
    event.preventDefault();
    if (!selectedOption) {
      setStatus('warning');
      setMessage('Please select one option before voting.');
      return;
    }

    setSubmitLoading(true);
    setMessage(null);

    try {
      await api.post(`/api/polls/${pollId}/vote`, { selectedOption });
      setStatus('success');
      setMessage('Vote recorded. Redirecting to results...');
      setTimeout(() => navigate(`/poll/${pollId}/results`), 1200);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Unable to submit vote.');
      if (error.response?.status === 409) {
        setTimeout(() => navigate(`/poll/${pollId}/results`), 1200);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!poll) {
    return (
      <Card title="Poll not found" description="We could not find the poll you are looking for." />
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">{poll.title}</h1>
            <p className="text-sm text-slate-400">Vote on this public poll below.</p>
          </div>
          <Link to={`/poll/${pollId}/results`} className="text-sm text-brand-300 hover:text-brand-100">
            View results
          </Link>
        </div>
      </section>

      <Card>
        {poll.isClosed ? (
          <div className="space-y-4">
            <Notification message="This poll is closed or expired. Voting is no longer available." status="warning" />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/poll/${pollId}/results`)}
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
              >
                See results
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVote} className="space-y-6">
            <div className="space-y-3">
              {poll.options.map((option) => (
                <label key={option.id} className="flex items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900 p-4 transition hover:border-brand-400">
                  <input
                    type="radio"
                    name="pollOption"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                    className="h-5 w-5 rounded-full text-brand-400"
                  />
                  <span className="text-slate-100">{option.label}</span>
                </label>
              ))}
            </div>
            {message && <Notification message={message} status={status} />}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit vote'}
              </Button>
              <button
                type="button"
                onClick={() => navigate(`/poll/${pollId}/results`)}
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
              >
                View results
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default VotePage;
