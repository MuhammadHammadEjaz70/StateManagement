import Counter from './features/couter/Counter';
import "./App.css"
import PostList from './features/posts/PostList';
import AddPostForm from './features/posts/AddPostForm';
import SinglePostPage from './features/posts/SinglePostPage';
import Layout from './components/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import EditPostForm from './features/posts/EditPostForm';
import User from "./features/users/User"
import UserList from "./features/users/UsersList"

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<PostList />} />

        <Route path="post" >
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UserList />} />
          <Route path=":userId" element={<User />} />
        </Route>
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;
