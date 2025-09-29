import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './providers/AuthProvider'
import AppRouter from './router'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRouter />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App