export const LoginStart = (userCredentials) => ({
  type: 'LOGIN_START',
});
export const LoginSuccess = (user) => ({
  type: 'LOGIN_SUCCESS',
  payload: user,
});
export const LoginFailure = (error) => ({
  type: 'LOGIN_FAILURE',
  payload: error,
});
export const Follow = (userId) => ({
  type: 'FOLLOW',
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: 'UNFOLLOW',
  payload: userId,
});
export const RegisterStart = (inputs) => ({
  type: 'REGISTER_START',
});
export const RegisterSuccess = (user) => ({
  type: 'REGISTER_SUCCESS',
  payload: user,
});
export const RegisterFailure = (error) => ({
  type: 'REGISTER_FAILURE',
  payload: error,
});
export const UpdateUser = (user) => ({
  type: 'UPDATE_USER',
  payload: user,
});
