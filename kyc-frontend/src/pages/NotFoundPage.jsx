import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="card">
      <h1>Page not found</h1>
      <Link to="/">Go home</Link>
    </div>
  )
}

export default NotFoundPage
