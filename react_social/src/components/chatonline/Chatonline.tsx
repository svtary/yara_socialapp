import { useEffect, useState } from 'react';
import './chatonline.scss';
import axios from 'axios';

export default function Chatonline({ onlineUsers, currentId, setCurrentchat }) {
  const [friends, setFriends] = useState([]);
  const [onlinefriends, setOnlinefriends] = useState([]);
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const token = JSON.parse(localStorage.getItem('user')).token;
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/friends/${currentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log('rs', res);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);
  // console.log('f', friends);

  const handleClick = async (user) => {
    let a = null;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/conversations/find/${currentId}/${user._id}`,
      );
      a = res.data;
      console.log('conclick', res.data);
      if (res.data == null) {
        const ress = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/conversations/`, {
          senderId: currentId,
          receiverId: user._id,
        });
        console.log('ressnew', ress);
        a = ress.data;
      }
      console.log('a', a);
      setCurrentchat(a.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setOnlinefriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);
  // console.log('onfreeeeee', onlinefriends);
  // onlinefriends.map((o) => console.log('o', o));
  return (
    <div className='chatonline'>
      <span className='title'>Online Friends</span>

      {onlinefriends.map((o) => (
        <div className='chatonlinefriend' onClick={() => handleClick(o)}>
          <div className='chatonlineimgcontainer'>
            <img
              className='chatonlineimg'
              crossOrigin='anonymous'
              src={
                o?.profilePicrure
                  ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${o.profilePicrure}`
                  : AVurl
              }
              alt=''
            />
            <div className='chaonlinebadge'></div>
          </div>
          <span className='chatonlinename'>{o.username}</span>
        </div>
      ))}
    </div>
  );
}
