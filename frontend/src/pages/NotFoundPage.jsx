import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-semibold text-white">Page not found</h1>
          <p className="text-slate-400">We could not find the page you were looking for. Return to the home page to continue.</p>
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default NotFoundPage;
