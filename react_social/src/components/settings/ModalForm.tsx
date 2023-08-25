import NiceModal, { useModal } from '@ebay/nice-modal-react';
import './modalform.scss';
import React, { useContext, useEffect, useRef, useState } from 'react';
import LazyLoad from 'react-lazyload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Modal, Box, Slider, Button } from '@mui/material';
import AvatarEditor from 'react-avatar-editor';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Cropper = ({ modalopen, setModalopen, src, setPreview }) => {
  console.log('src', src);
  const [slidevalue, setSlidevalue] = useState(10);
  const cropRef = useRef(null);
  const handleSave = async () => {
    // console.log('cropRef', cropRef);
    if (cropRef) {
      const dataUrl = cropRef.current.getImage().toDataURL();
      // console.log('ert', dataUrl);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      setPreview(URL.createObjectURL(blob));
      setModalopen(false);
    }
  };

  return (
    <Modal
      open={modalopen}
      sx={{
        display: ' flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box
        sx={{
          width: '300px',
          height: '300px',
          display: 'flex',
          flexFlow: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AvatarEditor
          ref={cropRef}
          image={src}
          style={{ width: '100%', height: '100%' }}
          border={50}
          borderRadius={150}
          scale={slidevalue / 10}
          color={[0, 0, 0, 0.72]}
          rotate={0}
        />
        <Slider
          min={10}
          max={50}
          sx={{
            margin: '0 auto',
            width: '80%',
            color: 'cyan',
          }}
          size='medium'
          defaultValue={slidevalue}
          value={slidevalue}
          onChange={(e) => setSlidevalue(e.target.value)}
        />
        <Box
          sx={{
            display: 'flex',
            padding: '10px',
            border: '3px solid white',
            background: 'black',
          }}>
          <Button
            size='small'
            sx={{ marginRight: '10px', color: 'white', borderColor: 'white' }}
            variant='outlined'
            onClick={(e) => setModalopen(false)}>
            cancel
          </Button>
          <Button
            sx={{ background: '#5596e6' }}
            size='small'
            variant='contained'
            onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const ModalForm = NiceModal.create(({ action }) => {
  const { user, dispatch } = useContext(AuthContext);
  const modal = useModal();
  const [inputs, setInputs] = useState({
    username: '',
    city: '',
    desc: '',
    relationship: 0,
    desc: '',
    profilePicrure: '',
    id: user._id,
  });
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const imgRef = useRef(null);
  const [modalopen, setModalopen] = useState(false);
  // console.log('prever', preview);
  const handleChange = (e) => {
    console.log([e.target.name], e.target.value);
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleoption = (e) => {
    console.log('e.target.value', e.target.value);
    if (e.target.value == 1) {
      setInputs((prev) => ({ ...prev, relationship: 1 }));
    } else {
      setInputs((prev) => ({ ...prev, relationship: 2 }));
    }
  };

  const handleImg = async (e) => {
    setInputs((prev) => ({ ...prev, profilePicrure: e.target.files[0].name }));
    // setSrc(e.target.files[0]);
    setSrc(URL.createObjectURL(e.target.files[0]));
    // uploadAvatar
    setModalopen(true);
    console.log(
      window.URL.createObjectURL(new Blob([e.target.files[0]], { type: 'application/zip' })),
    );
    // console.log('name', e.target.files[0].name);
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      const fileName = `${Date.now()}-${file.name}`;
      data.append('file', file);
      data.append('name', fileName);
      try {
        console.log('iam in uploda,data');
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/uploadAvatar`, data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  console.log('inputsss', inputs);
  return (
    <>
      <form className='modalform'>
        {/* <CropperModal
          modalOpen={modalOpen}
          src={src}
          setPreview={setPreview}
          setModalOpen={setModalOpen}
        /> */}
        <Cropper
          modalopen={modalopen}
          setModalopen={setModalopen}
          src={src}
          setPreview={setPreview}
        />
        <div className='inputimag'>
          <div className='img-container'>
            <img
              crossOrigin='anonymous'
              src={
                preview
                  ? preview
                  : `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`
                  ? `${import.meta.env.VITE_PUBLIC_FOLDER_AVA}${user.profilePicrure}`
                  : ' https://www.signivis.com/img/custom/avatars/member-avatar-01.png'
              }
              alt=''
              width='200'
              height='200'
            />
          </div>
          <div className='clickplus'>
            <AddCircleIcon
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: '80px',
              }}
            />
            <input
              className='inputimg'
              type='file'
              accept='image/*'
              style={{
                cursor: ' pointer',
                opacity: '0',
                position: 'absolute',
                right: '45%',
                bottom: '45%',
              }}
              ref={imgRef}
              onChange={handleImg}
            />
          </div>
        </div>

        <label>
          <span> Name:</span>
          <input type='text' name='username' value={user.username} onChange={handleChange} />
        </label>

        <label>
          <span>City:</span>
          <input type='text' value={user.city} name='city' onChange={handleChange} />
        </label>

        <label>
          <span>Relationship:</span>
          <select onChange={handleoption}>
            <option value='1'>Single</option>
            <option value='2'>In love</option>
          </select>
        </label>
        <label>
          <span>Desc:</span>
          <input type='text' name='desc' value={user.desc} onChange={handleChange} />
        </label>
        <div className='buttonall'>
          <button
            type='submit'
            className='submitbutton'
            onClick={() => {
              modal.remove();
            }}>
            Cancel
          </button>
          <button
            type='submit'
            className='submitbutton'
            onClick={() => {
              if (action === 'save') {
                if (inputs) {
                  modal.resolve(inputs);
                  modal.remove();
                  console.log('info saved');
                } else {
                  modal.resolve();
                  modal.remove();
                  console.log('not saved');
                }
              }
            }}>
            Save
          </button>
        </div>
      </form>
    </>
  );
});
export default ModalForm;
