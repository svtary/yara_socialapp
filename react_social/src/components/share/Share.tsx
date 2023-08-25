import './share.scss';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FilterIcon from '@mui/icons-material/Filter';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useRef } from 'react';
import axios from 'axios';

export default function Share() {
  const { user } = useContext(AuthContext);
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const desc = useRef();
  const [file, setFile] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    // console.log(desc.current.value);
    console.log('file', file);
    if (file) {
      const data = new FormData();
      const fileName = `${Date.now()}-${file.name}`;
      data.append('file', file);
      data.append('name', fileName);
      newPost.img = file.name;
      try {
        console.log('iam in uploda,data');
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload`, data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/posts`, newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='share'>
      <div className='container'>
        <div className='top'>
          <img
            crossOrigin='anonymous'
            src={
              user.profilePicrure
                ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`
                : AVurl
            }
            alt=''
          />
          <input type='text' placeholder={`What's on your mind ${user.username}?`} ref={desc} />
        </div>
        <hr />
        {file && (
          <div className='.shareimgcontainer'>
            <img className='shareImg' src={URL.createObjectURL(file)} />
            <CancelOutlinedIcon className='sharecancel' onClick={() => setFile(null)} />
          </div>
        )}
        <form className='bottom' onSubmit={submitHandler}>
          <div className='left'>
            <label htmlFor='file' className='item'>
              <FilterIcon />
              <span>Add Image</span>
              <input
                style={{ display: 'none' }}
                type='file'
                id='file'
                accept='.png,.jpeg,.jpg'
                onChange={(e) => {
                  console.log(e.target);
                  setFile(e.target.files[0]);
                }}
              />
            </label>

            <div className='item'>
              <InsertEmoticonIcon />
              <span>Emoji</span>
            </div>
            <div className='item'>
              <MyLocationIcon />
              <span>Add Place</span>
            </div>
            <div className='item'>
              <AlternateEmailIcon />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className='right'>
            <button type='submit'>Share</button>
          </div>
        </form>
      </div>
    </div>
  );
}
