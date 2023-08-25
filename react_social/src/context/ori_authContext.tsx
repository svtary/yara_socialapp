// import { createContext, useEffect, useState, Children } from 'react';
// import { CurrentUserContextT } from '../types/types';
// import imgURL from '../assets/2.jpg';
// export const AuthContext = createContext<CurrentUserContextT | null>(null);
// export const AuthContextProvider: React.FC<CurrentUserContextT> = ({ children }) => {
//   const [currentUser, setcurrentUser] = useState(JSON.parse(localStorage.getItem('user') || null));
//   const login = () => {
//     setcurrentUser({
//       _id: '6479f5cfba2b94e1db8cc7c8',
//       name: 'yara',
//       profilePic:
//         'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600',
//     });
//   };
//   useEffect(() => {
//     localStorage.setItem('user', JSON.stringify(currentUser));
//   }, [currentUser]);

//   return <AuthContext.Provider value={{ currentUser, login }}>{children}</AuthContext.Provider>;
// };
