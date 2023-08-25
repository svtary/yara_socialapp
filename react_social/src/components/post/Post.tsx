import './post.scss';
import { Link } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useState, useContext } from 'react';
import Comments from '../comments/Comments';
import { useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'timeago.js';

export default function Post({ post }) {
  // console.log('post', post);
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [commentOpen, setCommentOpen] = useState(false);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const likeHandler = () => {
    try {
      axios.put(`${import.meta.env.VITE_BASE_URL}/api/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users?userId=${post.userId}`,
      );
      // console.log('res in ava', res);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);
  // console.log(`${import.meta.env.VITE_PUBLIC_FOLDER}${post.img}`);
  // console.log(`http://localhost:8800/images/7.jpg`);
  return (
    <div className='post'>
      <div className='container'>
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
            <div className='details'>
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}>
                {' '}
                <span className='name'>{user.username}</span>
              </Link>

              <span className='date'>{format(post.createdAt)}</span>
            </div>
          </div>
          <MoreHorizOutlinedIcon />
        </div>
        <div className='content'>
          <p>{post?.desc}</p>
          <img
            crossOrigin='anonymous'
            src={post.img ? `${import.meta.env.VITE_PUBLIC_FOLDER}${post.img}` : null}
            alt=''
          />
        </div>
        <div className='info'>
          <div className='item' onClick={likeHandler}>
            {isLiked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            <span>{like} likes</span>
          </div>
          <div className='item' onClick={() => setCommentOpen(!commentOpen)}>
            <CommentOutlinedIcon />
            12 comments
          </div>
          <div className='item'>
            <ShareOutlinedIcon />
          </div>
        </div>
        {commentOpen && <Comments />}
      </div>
    </div>
  );
}
