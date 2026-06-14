import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-start">
        <Button type="button" variant="secondary" onClick={() => navigate('/')}>Back</Button>
      </div>

      <h1 className="text-3xl font-semibold text-white">Features</h1>

      <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-6">
        <p className="mb-4 text-slate-300">QuickPoll implements the following features:</p>
        <ul className="space-y-3 text-slate-200 list-inside list-disc">
          <li><strong>Create poll</strong> — title, 2–5 options, optional expiry.</li>
          <li><strong>Shareable unique poll link</strong> — share and vote via URL.</li>
          <li><strong>Anonymous voting</strong> — no auth required for voters.</li>
          <li><strong>Results with charts</strong> — responsive chart-based results view.</li>
          <li><strong>Admin dashboard with token access</strong> — secure admin token for management.</li>
          <li><strong>Duplicate vote prevention</strong> — cookie/fingerprint based prevention.</li>
          <li><strong>Poll expiry system</strong> — optional expiry and automatic closure.</li>
          <li><strong>Backend + frontend integration</strong> — REST API with MongoDB and Mongoose.</li>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="mb-2 text-lg font-medium text-white">Create Poll</h3>
          <p className="text-slate-300">Create a poll with a question, up to five options, and an optional expiry date/time.</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="mb-2 text-lg font-medium text-white">Share & Vote</h3>
          <p className="text-slate-300">Share a unique link to allow anonymous voting without login.</p>
        </div>
      </div>
    </div>
  );
}

export default FeaturesPage;
