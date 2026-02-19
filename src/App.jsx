import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import AddEditPostPage from './pages/AddEditPostPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* ÖNEMLİ: :id parametresi doğru tanımlanmış mı? */}
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/add-post" 
            element={
              <PrivateRoute>
                <AddEditPostPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/edit-post/:id" 
            element={
              <PrivateRoute>
                <AddEditPostPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;