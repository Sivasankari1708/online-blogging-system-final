import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PostDetails } from './pages/PostDetails';
import { CreatePost } from './pages/CreatePost';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { Explore } from './pages/Explore';
import { Bookmarks } from './pages/Bookmarks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="post/:postId" element={<PostDetails />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="explore" element={<Explore />} />
          <Route path="bookmarks" element={<Bookmarks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
