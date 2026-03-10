import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  )
}

export default NotFoundPage
