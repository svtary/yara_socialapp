import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import './navbar.scss';
import { useContext, useState } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { AuthContext } from '../../context/AuthContext';

import { Link, Redirect, Navigate } from 'react-router-dom';
import axios from 'axios';
import ModalForm from '../settings/ModalForm';
import NiceModal from '@ebay/nice-modal-react';

export default function Navbar() {
  const [dropstatus, setDropstatus] = useState(false);
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { user, dispatch } = useContext(AuthContext);
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const handleClick = () => {
    setDropstatus(!dropstatus);
  };

  const showModal = () => {
    NiceModal.show(ModalForm, { action: 'save' }).then(async (inputs) => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/update`, inputs);
        console.log('resinshowmale', res);
        dispatch({ type: 'UPDATE_USER', payload: res.data });
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.log(err);
      }
    });
  };
  // console.log('dropstatus', user);
  console.log('dropstatus', `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`);
  return (
    <div className='navbar'>
      <div className='left'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <span> YARA SOCIAL</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? <DarkModeOutlinedIcon onClick={toggle} /> : <WbSunnyIcon onClick={toggle} />}

        <AppsOutlinedIcon />
        <div className='search'>
          <SearchOutlinedIcon />
          <input type='text' placeholder='Search...' />
        </div>
      </div>
      <div className='right'>
        <PersonPinOutlinedIcon />
        <EmailOutlinedIcon />
        <CircleNotificationsOutlinedIcon />

        <div className='user' onClick={handleClick}>
          {/* <Link to={`/profile/${user._id}`}>
            <img src={user.profilePicrure ? user.profilePicrure : AVurl} alt='' />
          </Link> */}
          <div className='dup'>
            <img
              crossOrigin='anonymous'
              src={
                user.profilePicrure
                  ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`
                  : AVurl
              }
              alt=''
            />
            <span>{user.username}</span>
          </div>

          {dropstatus ? (
            <div className='dropbar'>
              <Link to={`/profile/${user._id}`}>
                <span>Profile</span>
              </Link>

              <span
                onClick={() => {
                  showModal();
                }}>
                Settings
              </span>

              <Link to={`/profile/${user._id}`}>
                <span>Logout</span>
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
