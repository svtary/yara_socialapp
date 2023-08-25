import { useState } from 'react';
import './register.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registercall } from '../../apiCalls';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Register() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    console.log([e.target.name], e.target.value);
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, inputs);
      registercall(inputs, dispatch);
      navigate('/verify');
    } catch (err) {
      toast.error(err.response.data);
      setErr(err.response.data);
    }
  };
  console.log(err);
  return (
    <div className='register'>
      <div className='card'>
        <div className='left'>
          <h1>Hello this is Yara social!</h1>
          <p> The function of this app is to build your social network</p>
          <span>Do you hava an account?</span>
          <Link to='/login'>
            <button>Login</button>
          </Link>
        </div>
        <div className='right'>
          <h1>Register</h1>
          <form>
            <input
              type='text'
              required
              placeholder='Username'
              name='username'
              onChange={handleChange}
            />
            <input type='email' required placeholder='Email' name='email' onChange={handleChange} />
            <input
              type='password'
              required
              minLength='6'
              placeholder='Password'
              name='password'
              onChange={handleChange}
            />
            <button type='submit' onClick={handleClick}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
