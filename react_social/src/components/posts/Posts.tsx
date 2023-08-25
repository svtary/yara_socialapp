import './posts.scss';
import Post from '../post/Post';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function Posts({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    // console.log('posts renders', import.meta.env.VITE_BASE_URL);
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts/profile/${username}`)
        : await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts/timeline/${user._id}`);

      // console.log('resid', res);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }),
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className='posts'>
      {posts.map((post) => (
        <div className='post'>
          <Post key={post._id} post={post} />
        </div>
      ))}
    </div>
  );
}
