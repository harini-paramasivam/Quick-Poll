import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-brand-500/15 px-4 py-1 text-sm uppercase tracking-[0.24em] text-brand-200">
            QuickPoll</span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build polls, share them instantly, and watch results in real time.
            </h1>
            <p className="max-w-2xl text-slate-400">
              QuickPoll lets you create public polls with no login required. Share the unique link, collect votes, and manage the poll from a private dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/create">
              <Button>Start a Poll</Button>
            </Link>
            <Link to="/features">
              <Button variant="secondary">See Features</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
          <h2 className="mb-4 text-xl font-semibold text-white">QuickPoll in a glance</h2>
          <ul className="space-y-4 text-slate-300">
            <li>• Create 2–5 option polls with optional expiry.</li>
            <li>• Public voting through a shareable poll URL.</li>
            <li>• Dashboard access via secure admin token.</li>
            <li>• Responsive chart-based results and vote percentages.</li>
            <li>• No authentication required for voters.</li>
          </ul>
        </div>
      </section>

      <section id="features" className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Create Polls', description: 'Build a poll with a question, up to five options, and an optional expiry time.' },
          { title: 'Vote Anywhere', description: 'Anyone with the poll link can vote without signing in or creating an account.' },
          { title: 'Manage Securely', description: 'Creator dashboard uses a private admin token to close polls and monitor results.' },
        ].map((feature) => (
          <Card key={feature.title} title={feature.title} description={feature.description} />
        ))}
      </section>
    </div>
  );
}

export default HomePage;
