import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <div className="card">
      <h1>Not authorized</h1>
      <p>You do not have access to this page.</p>
      <Link to="/">Go to my dashboard</Link>
    </div>
  )
}

export default UnauthorizedPage
