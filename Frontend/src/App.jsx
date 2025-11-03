import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext.jsx'; // Import useAuth
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NoteDetailPage from './pages/NoteDetailPage';
import ProfilePage from './pages/ProfilePage';
// ... other page imports

const App = () => {
  const { loading } = useAuth(); // Get the loading state

  // // Show a loading screen while the initial auth check runs
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <span className="loading loading-spinner loading-lg text-primary"></span>
  //     </div>
  //   );
  // }

  // Once loading is false, render the actual routes
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path='/notes/:id' element={<ProtectedRoute><NoteDetailPage /></ProtectedRoute>} />
        <Route path='/create-note' element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path='/edit-note/:id' element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};
export default App;
// import React from 'react'
// import CreatePage from './pages/CreatePage'
// import HomePage from './pages/HomePage'
// import NoteDetailPage from './pages/NoteDetailPage'
// import { Route, Routes } from 'react-router'
// import toast from 'react-hot-toast'

// const App = () => {
//   return (
//     // <div data-theme="forest"></div>
//     <div className="relative h-full w-full">
//       <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%, #000_60%,#00FF9D40_100%)]"/>
//       <Routes>

//       <Route path='/' element= {< HomePage />} />
//       <Route path='/create' element= {< CreatePage />} />
//       <Route path='/note/:id' element= {< NoteDetailPage />} />

//       </Routes>
//     </div>
//   )
// }

// export default App
