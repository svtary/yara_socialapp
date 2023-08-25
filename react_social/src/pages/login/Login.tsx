import './login.scss';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useRef } from 'react';
import { loginCall } from '../../apiCalls';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const email = useRef();
  const password = useRef();
  // const handleLogin = () => {
  //   login();
  // };
  const handleClick = (e) => {
    e.preventDefault();
    loginCall({ email: email.current.value, password: password.current.value }, dispatch);
  };
  if (user) {
    return <Navigate to='/' />;
    // navigate('/');
  }
  console.log('user', user);
  return (
    <div className='login'>
      <div className='card'>
        <div className='left'>
          <h1>Hello this is Yara social!</h1>
          <p> The function of this app is to build your social network</p>
          <span>don't you have an account?</span>
          <Link to='/register'>
            <button>Register</button>
          </Link>
        </div>
        <div className='right'>
          <h1>Login</h1>
          <form onSubmit={handleClick}>
            <input placeholder='Email' ref={email} />
            <input type='password' placeholder='Password' required minLength='6' ref={password} />
            <span className='loginForgot'>Forgot Password?</span>
            <button type='submit'>
              {isFetching ? <CircularProgress color='primary' size='15px' /> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
