import "./styles/main.scss";
import Login from "./views/auth/Login.tsx";
import Registration from "./views/auth/Registration.tsx";
import RequestPwdResetView from "./views/auth/RequestPwdResetView.tsx";
import EmailConfirmationView from "./views/auth/EmailConfirmationView.tsx";
import PwdResetView from "./views/auth/PwdResetView.tsx";
import { Route, Routes } from 'react-router-dom';
import AllPosts from "./views/AllPosts.tsx";
import UserPosts from "./views/UserPosts.js";
import CreatePost from "./views/CreatePost.tsx";
import Layout from "./Layout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import BlogView from "./views/BlogView.tsx";
import LegalView from "./views/legal/LegalView.tsx";
import LandingPage from "./views/LangingPage.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";

function App() {

  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App
