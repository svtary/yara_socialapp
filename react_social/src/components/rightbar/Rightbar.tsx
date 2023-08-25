import './rightbar.scss';
import imgURL from '../../assets/2.jpg';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

import { useCallback } from 'react';

export default function Rightbar() {
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const [allusers, setAllusers] = useState([]);
  const [user, setUser] = useState({});
  const token = JSON.parse(localStorage.getItem('user')).token;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user._id]);

  const getalluser = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/allusers`);
      setAllusers(res.data);
      console.log('right', res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);
  useEffect(() => {
    getalluser();
  }, []);

  const handleClick = async (id) => {
    try {
      if (followed) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/users/${id}/unfollow`,
          {
            userId: currentUser._id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch({ type: 'UNFOLLOW', payload: id });
        console.log('resdataunfollow', res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } else {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/users/${id}/follow`,
          {
            userId: currentUser._id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch({ type: 'FOLLOW', payload: id });
        console.log('resdatfollow', res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
  };

  console.log('usert', allusers);
  return (
    <div className='rightbar'>
      <div className='container'>
        <div className='item'>
          <span>Online Friends</span>
          <div className='user'>
            <div className='userInfo'>
              <img src={imgURL} alt='' />
              <div className='online' />
              <span>Jane</span>
            </div>
          </div>
        </div>

        {/* <div className='item'>
          <span>Latest Activities</span>
          <div className='user'>
            <div className='userInfo'>
              <img src={imgURL} alt='' />
              <p>
                <span>Jane</span>
                changed there cover picture
              </p>
            </div>
            <span> 1 minute ago</span>
          </div>
          <div className='user'>
            <div className='userInfo'>
              <img src={imgURL} alt='' />
              <p>
                <span>Jane</span>
                changed there cover picture
              </p>
            </div>
            <span> 1 minute ago</span>
          </div>
          <div className='user'>
            <div className='userInfo'>
              <img src={imgURL} alt='' />
              <p>
                <span>Jane</span>
                changed there cover picture
              </p>
            </div>
            <span> 1 minute ago</span>
          </div>
          <div className='user'>
            <div className='userInfo'>
              <img src={imgURL} alt='' />
              <p>
                <span>Jane</span>
                changed there cover picture
              </p>
            </div>
            <span> 1 minute ago</span>
          </div>
        </div> */}

        <div className='item'>
          <span>Suggest for you</span>
          {allusers.map((user) => (
            <>
              <div className='user'>
                <div className='userInfo'>
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
                <div className='buttons'>
                  <button onClick={(e) => handleClick(user._id)}>
                    {followed ? 'Unfollow' : 'Follow'}
                  </button>
                  {/* <button onClick={handleClick}>Dismiss</button> */}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
