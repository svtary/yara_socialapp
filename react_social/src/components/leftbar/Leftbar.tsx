import './leftbar.scss';

import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import VideoSettingsOutlinedIcon from '@mui/icons-material/VideoSettingsOutlined';
// import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
// import PixOutlinedIcon from '@mui/icons-material/PixOutlined';
// import CastForEducationOutlinedIcon from '@mui/icons-material/CastForEducationOutlined';
// import GolfCourseOutlinedIcon from '@mui/icons-material/GolfCourseOutlined';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

export default function Leftbar() {
  const { user } = useContext(AuthContext);
  const AVurl = 'https://img.51miz.com/Element/00/77/27/27/aa9d01e6_E772727_a2b797c2.png';
  console.log('current', user);

  return (
    <div className='leftbar'>
      <div className='container'>
        <div className='menu'>
          <div className='user'>
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
          <div className='item'>
            <Person2OutlinedIcon />
            <Link
              to='/messenger'
              style={{ textDecoration: 'none', cursor: 'pointer', color: 'inherit' }}>
              <span>Friends</span>
            </Link>
          </div>
          <div className='item'>
            <Diversity3OutlinedIcon />
            <Link
              to='/groupchat'
              style={{ textDecoration: 'none', cursor: 'pointer', color: 'inherit' }}>
              <span>Groups</span>
            </Link>
          </div>
          <div className='item'>
            <StorefrontOutlinedIcon />
            <span>Markplaces</span>
          </div>
          <div className='item'>
            <SlideshowOutlinedIcon />
            <span>Watch</span>
          </div>
          <div className='item'>
            <HistoryToggleOffOutlinedIcon />
            <span>Memories</span>
          </div>
          <hr />
          <div className='menu'>
            <span>Your shortcuts</span>
          </div>
          <div className='item'>
            <EventAvailableOutlinedIcon />
            <span>Events</span>
          </div>
          <div className='item'>
            <SportsEsportsOutlinedIcon />
            <span>Gaming</span>
          </div>
          <div className='item'>
            <PhotoLibraryOutlinedIcon />
            <span>Gallery</span>
          </div>
          <div className='item'>
            <VideoSettingsOutlinedIcon />
            <span>Videos</span>
          </div>
          {/* <div className='item'>
            <Diversity3OutlinedIcon />
            <span>Fund</span>
          </div>
          <div className='item'>
            <Diversity3OutlinedIcon />
            <span>Tutorials</span>
          </div>
          <div className='item'>
            <Diversity3OutlinedIcon />
            <span>Courses</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
