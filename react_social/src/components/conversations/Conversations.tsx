import axios from 'axios';
import './conversations.scss';
import { useState, useEffect } from 'react';

export default function Conversations({ conversation, currentuser }) {
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const [user, setUser] = useState(null);
  const token = JSON.parse(localStorage.getItem('user')).token;
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentuser._id);
    console.log('friendid', friendId);
    const getUser = async () => {
      try {
        const res = await axios(`${import.meta.env.VITE_BASE_URL}/api/users?userId=${friendId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('resinconvuser', res);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentuser, conversation]);
  return (
    <>
      <div className='conversations'>
        <img
          className='conversationimg'
          crossOrigin='anonymous'
          src={
            user?.profilePicrure
              ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`
              : AVurl
          }
          alt=''
        />
        <span className='conversationame'>{user?.username} </span>
      </div>
    </>
  );
}
