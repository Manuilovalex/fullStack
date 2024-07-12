import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'

interface SigninFormProps {
  onClose: () => void
}

const SigninForm: React.FC<SigninFormProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true)

  const showRegistration = () => {
    setIsLogin(false)
  }

  return (
    <div className="signin-form">
      {isLogin ? (
        <>
          <LoginForm onClose={onClose} />
          <div className='registr-link'>
            <h4>
              Don't have an account? Please{' '}
              <button className="registr" onClick={showRegistration}>
                Register
              </button>
            </h4>
          </div>
        </>
      ) : (
        <>
          <RegistrationForm onClose={onClose} />
        </>
      )}
    </div>
  )
}

export default SigninForm
