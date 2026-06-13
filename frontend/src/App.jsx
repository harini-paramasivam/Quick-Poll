import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePollPage from './pages/CreatePollPage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-white">
            QuickPoll
          </Link>
          <nav className="flex gap-3 text-slate-300">
            <Link className="hover:text-white transition" to="/create">
              Create Poll
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePollPage />} />
          <Route path="/poll/:pollId" element={<VotePage />} />
          <Route path="/poll/:pollId/results" element={<ResultsPage />} />
          <Route path="/manage/:adminToken" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
