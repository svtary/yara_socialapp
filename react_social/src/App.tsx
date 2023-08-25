import './style.scss';
import { Navigate, Outlet, Route, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useContext, lazy, Component, Suspense } from 'react';
import { DarkModeContext } from './context/darkModeContext';
import { AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Navbar from '../src/components/navbar/Navbar';
import Leftbar from '../src/components/leftbar/Leftbar';
import Rightbar from '../src/components/rightbar/Rightbar';
import 'react-toastify/dist/ReactToastify.css';
import Group from './pages/group/Group';

function App() {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  console.log(darkMode);

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <LeftbarPage />
          <div style={{ flex: 6, backgroundColor: darkMode ? '#333' : '#f6f3f3' }}>
            <Outlet />
          </div>

          <RightbarPage />
        </div>
      </div>
    );
  };
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to='/login' />;
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ path: '/', element: <HomePage /> }],
    },
    {
      path: '/profile/:id',
      element: (
        <ProtectedRoute>
          <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
            <NavbarPage />
            <div style={{ display: 'flex' }}>
              <LeftbarPage />
              <div style={{ flex: 6 }}>
                <ProfilePage />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      ),
    },

    {
      path: '/messenger',
      element: (
        <ProtectedRoute>
          <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
            <NavbarPage />
            <div style={{ display: 'flex' }}>
              <LeftbarPage />
              <div style={{ flex: 6 }}>
                <MessengerPage />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/groupchat',
      element: (
        <ProtectedRoute>
          <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
            <NavbarPage />
            <div style={{ display: 'flex' }}>
              <Leftbar />
              <div style={{ flex: 6 }}>
                <GroupPage />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      ),
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/verify', element: <VerifyPage /> },
  ]);
  return (
    <>
      <ToastContainer
        position='bottom-left'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
      <RouterProvider router={router} />
    </>
  );
}

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};
const HomePage = Loadable(lazy(() => import('../src/pages/home/Home')));
const RegisterPage = Loadable(lazy(() => import('../src/pages/register/Register')));
const LoginPage = Loadable(lazy(() => import('../src/pages/login/Login')));
const VerifyPage = Loadable(lazy(() => import('../src/pages/verify/verify')));
const ProfilePage = Loadable(lazy(() => import('../src/pages/profile/Profile')));
const MessengerPage = Loadable(lazy(() => import('../src/pages/messenger/Messenger')));
const LeftbarPage = Loadable(lazy(() => import('../src/components/leftbar/Leftbar')));
const NavbarPage = Loadable(lazy(() => import('../src/components/navbar/Navbar')));
const RightbarPage = Loadable(lazy(() => import('../src/components/rightbar/Rightbar')));
const GroupPage = Loadable(lazy(() => import('../src/pages/group/Group')));
export default App;
