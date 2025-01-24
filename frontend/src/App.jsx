import "./styles/main.scss";
import { AuthContext } from "./context/AuthContext.js";
import { useEffect, useState } from "react";
import Login from "./views/auth/Login.jsx";
import Registration from "./views/auth/Registration.jsx";
import RequestPwdResetView from "./views/auth/RequestPwdResetView.jsx";
import EmailConfirmationView from "./views/auth/EmailConfirmationView.jsx";
import PwdResetView from "./views/auth/PwdResetView.jsx";
import { Route, Routes, useNavigate } from 'react-router-dom';
import AllPosts from "./views/AllPosts.jsx";
import UserPosts from "./views/UserPosts.jsx";
import CreatePost from "./views/CreatePost.jsx";
import Layout from "./Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BlogView from "./views/BlogView.jsx";
import LegalView from "./views/legal/LegalView.jsx";
import LandingPage from "./views/LangingPage.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authIsLoading, setAuthIsLoading] = useState(true);
  const navigate = useNavigate(); // für redirect in logout button

  useEffect(() => {
    if (getToken()) {
      setIsAuthenticated(true);
    }
    setAuthIsLoading(false);
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

  console.log("isAuthenticated", isAuthenticated)

  return (
    <AuthContext.Provider value={{ isAuthenticated, authIsLoading, login, getToken, logout }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index element={<LandingPage />}></Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="blog" element={<BlogView />} />
          <Route path="impressum" element={<LegalView type="impressum" />} />
          <Route path="privacy" element={<LegalView type="privacy" />} />
          <Route path="verify/:token" element={<EmailConfirmationView />} />
          {/* link to this page on login page */}
          <Route path="request-pwd-reset" element={<RequestPwdResetView />}/>
          {/* link to this page sent by email */}
          <Route path="pwd-reset/:token" element={<PwdResetView />}/>

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
