import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-bold text-muted">404</h1>
      <p className="mt-2 text-lg text-muted">Page not found</p>
      <p className="mt-1 text-sm text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
