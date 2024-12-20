import "./App.css";
import { AuthContext } from "./context/AuthContext.js";
import { useEffect, useState } from "react";
import Login from "./views/Login.jsx";
import Registration from "./views/Registration.jsx";
import { Route, Routes, useNavigate } from 'react-router-dom';
import AllPosts from "./views/AllPosts.jsx";
import UserPosts from "./views/UserPosts.jsx";
import CreatePost from "./views/CreatePost.jsx";
import Layout from "./Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BlogView from "./views/BlogView.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // für redirect in logout button

  useEffect(() => {
    if (getToken()) {
      setIsAuthenticated(true);
    }
  }, [])

  function login(token) {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate("/");
}

  function getToken() {
    return localStorage.getItem('token');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, getToken, logout }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="blog" element={<BlogView />} />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<AllPosts />} />
            <Route path="posts" element={<AllPosts />} />
            <Route path="account/posts" element={<UserPosts />} />
            <Route path="newpost" element={<CreatePost />} />
          </Route>
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
