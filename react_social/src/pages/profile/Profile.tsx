import './profile.scss';
import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Posts from '../../components/posts/Posts';
import Share from '../../components/share/Share';
import imgURL from '../../assets/2.jpg';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const params = useParams();
  // const urlrightnow = window.location.href;
  // const idinprofile = urlrightnow.split('/')[4];
  // console.log(urlrightnow.split('/')[4]);
  const { user: currentUser, dispatch: any } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));
  const token = JSON.parse(localStorage.getItem('user')).token;

  const username = useParams().username;
  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user._id]);

  // console.log(user._id);
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/friends/${user._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('firnedos', friendList.data);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user._id]);
  // console.log('paras', params);
  useEffect(() => {
    // console.log('profile renders');
    const fetchUser = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users?userId=${params.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('resinorfiule', res);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/users/${user._id}/unfollow`,
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
        dispatch({ type: 'UNFOLLOW', payload: user._id });
      } else {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/users/${user._id}/follow`,
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
        dispatch({ type: 'FOLLOW', payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
  };
  return (
    <div className='profile'>
      <div className='downprofile'>
        <div className='centerprofile'>
          <div className='images'>
            <img
              src={
                user.coverPicture ||
                'https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }
              alt=''
              className='cover'
            />
          </div>
          <div className='profileContainer'>
            <div className='zhong'>
              <div className='uInfo'>
                <img
                  crossOrigin='anonymous'
                  src={
                    user.profilePicrure
                      ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`
                      : AVurl
                  }
                  alt=''
                  className='profilePic'
                />
                <div className='left'>
                  <a href='http://facebook.com'>
                    <FacebookTwoToneIcon fontSize='large' />
                  </a>
                  <a href='http://facebook.com'>
                    <InstagramIcon fontSize='large' />
                  </a>
                  <a href='http://facebook.com'>
                    <TwitterIcon fontSize='large' />
                  </a>
                  <a href='http://facebook.com'>
                    <LinkedInIcon fontSize='large' />
                  </a>
                  <a href='http://facebook.com'>
                    <PinterestIcon fontSize='large' />
                  </a>
                </div>
                <div className='center'>
                  <span>{user.username}</span>
                  <div className='info'>
                    <div className='item'>
                      <PlaceIcon />
                      <span>USA</span>
                    </div>
                    <div className='item'>
                      <LanguageIcon />
                      <span>lama.dev</span>
                    </div>
                  </div>
                  {user.username !== currentUser.username && (
                    <button onClick={handleClick}>{followed ? 'Unfollow' : 'Follow'}</button>
                  )}
                </div>
                <div className='right'>
                  <EmailOutlinedIcon />
                  <MoreVertIcon />
                </div>
              </div>
              {user.username == currentUser.username && <Share />}
              <Posts username={user.username} />
            </div>

            {/* rightbar */}
            <div className='rightprofile'>
              <div className='rightbar'>
                <div className='container'>
                  <div className='item'>
                    <span>User Infomation</span>
                    <div className='userifmor'>
                      <span className='tytle'>description: {user.desc}</span>
                      <span className='tytle'>name: {user.username}</span>
                      <span className='tytle'>city: {user.city}</span>
                      <span className='tytle'>
                        relationship:{' '}
                        {user.relationship === 1
                          ? 'single'
                          : user.relationship === 2
                          ? 'Married'
                          : '-'}
                      </span>
                    </div>
                  </div>
                  {friends.map((friend: any) => (
                    <div className='item'>
                      <span>User Friends</span>
                      <Link to={`/profile/${friend._id}`}>
                        <div className='user'>
                          <div className='userInfo'>
                            <img
                              crossOrigin='anonymous'
                              src={
                                friend.profilePicrure
                                  ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${
                                      friend.profilePicrure
                                    }`
                                  : AVurl
                              }
                              alt=''
                            />

                            <span>{friend.username}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
