import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiClient';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';

const emptyOption = '';

function CreatePollPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiry, setExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('info');

  const handleAddOption = () => {
    if (options.length >= 5) return;
    setOptions((current) => [...current, emptyOption]);
  };

  const handleOptionChange = (index, value) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) return;
    setOptions((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        title,
        options,
        expiresAt: expiry ? new Date(expiry).toISOString() : null,
      };
      const response = await api.post('/api/polls', payload);
      setStatus('success');
      setMessage('Poll created successfully. Redirecting to dashboard...');
      setTimeout(() => {
        navigate(`/manage/${response.data.adminToken}`);
      }, 1000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Unable to create the poll.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-white">Create a new poll</h1>
          <p className="max-w-2xl text-slate-400">
            Set a question, add between two and five options, and optionally close voting automatically with an expiry date.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200" htmlFor="title">
              Poll question
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full bg-slate-950 px-4 py-3"
              placeholder="What should we build next?"
              required
              minLength={5}
              maxLength={200}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-200">Options</p>
              <button
                type="button"
                onClick={handleAddOption}
                disabled={options.length >= 5}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add option
              </button>
            </div>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={option}
                    onChange={(event) => handleOptionChange(index, event.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full bg-slate-950 px-4 py-3"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    className="inline-flex items-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200" htmlFor="expiry">
              Expiry date (optional)
            </label>
            <input
              id="expiry"
              type="datetime-local"
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
              className="w-full bg-slate-950 px-4 py-3"
            />
            <p className="text-sm text-slate-500">Leave empty to keep the poll open indefinitely.</p>
          </div>

          <div className="space-y-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create poll'}
            </Button>
            {loading && <LoadingSpinner />}
            {message && <Notification message={message} status={status} />}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreatePollPage;
