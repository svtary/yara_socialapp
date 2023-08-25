import { useContext, useState } from 'react';
import './verify.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: '',
    otp: '',
  });
  const { user } = useContext(AuthContext);
  // console.log('inrveee', user);
  const [err, setErr] = useState(null);
  const handleChange = (e) => {
    // console.log([e.target.name], e.target.value);
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      inputs.email = user.email;
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/verify`, inputs);
      console.log('resinverfiy', res);
      if (res) {
        navigate('/');
      }
    } catch (err) {
      setErr(err);
    }
  };
  console.log(err);
  return (
    <div className='verify'>
      <div className='card'>
        <div className='left'>
          <h1>Hello this is Yara social!</h1>
          <p> The function of this app is to build your social network</p>
        </div>
        <div className='right'>
          <h1>Please Verify OTP</h1>
          <form>
            <input type='text' placeholder='OTP' name='otp' onChange={handleChange} />
            <button onClick={handleClick}>Verify</button>
          </form>
        </div>
      </div>
    </div>
  );
}
