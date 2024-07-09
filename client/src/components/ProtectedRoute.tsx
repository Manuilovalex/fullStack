import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

interface ProtectedRouteProps {
  element: JSX.Element
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin)

  return isLogin ? element : <Navigate to="/" replace />
}

export default ProtectedRoute
