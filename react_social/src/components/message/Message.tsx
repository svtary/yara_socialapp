import './message.scss';
import { format } from 'timeago.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Message({ fetchAgain, setFetchAgain, message, own, current }) {
  // console.log('curerencta', current);
  const token = JSON.parse(localStorage.getItem('user')).token;
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const { user } = useContext(AuthContext);
  const friendId = current.members
    ? current.members.find((m) => m !== user._id)
    : current.users.find((m) => m._id === message.sender);
  // console.log('current.users', current.users);
  // console.log('fffffff', friendId);
  // console.log('mmm', message);
  const [friend, setFriend] = useState(null);

  const binaryToBlob = (binary) => {
    console.log('binaergfa', binary);
    const unit8Array = Uint8Array.from(binary.data);
    console.log('unitarray', unit8Array);
    const blob = new Blob([unit8Array], { type: 'audio/mp3' });
    console.log('bliobaa', blob);
    const bloburl = URL.createObjectURL(blob);
    console.log('bloburl', bloburl);
    console.log(typeof bloburl);
    return bloburl;
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users?userId=${message.sender}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // console.log('firendinmeds', res);
        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [user, current]);
  return (
    <>
      <div className={own ? 'message own' : 'message'}>
        <div className='messagetop'>
          <img
            className='messageimg'
            crossOrigin='anonymous'
            src={
              own
                ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`
                : `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${friend?.profilePicrure}`
            }
            alt=''
          />
          {!message.isMedia ? (
            <p className=' messagetext'>{message?.text}</p>
          ) : (
            // <audio controls>
            //   <source src={binaryToBlob(message.buffer)} type='audio/mp3' crossOrigin='anonymous' />
            // </audio>
            <audio controls src={binaryToBlob(message.buffer)} />
          )}
        </div>
        <div className='messagebottom'>{format(message.createdAt)}</div>
      </div>
    </>
  );
}
