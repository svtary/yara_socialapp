import axios from 'axios';

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: 'LOGIN_START' });
  try {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, userCredential);
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
  } catch (err) {
    dispatch({ type: 'LOGIN_FAILURE', payload: err });
  }
};

export const registercall = async (inputs, dispatch) => {
  dispatch({ type: 'REGISTER_START' });
  try {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, inputs);
    // console.log('resintext', res.data);
    dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
  } catch (err) {
    dispatch({ type: 'REGISTER_FAILURE', payload: err });
  }
};
