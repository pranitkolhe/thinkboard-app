import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  // Get 'user' and 'profile' from the global context
  const { user, profile, signOut } = useAuth(); 

  return (
    <header className='navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 md:px-8'>
      <div className='flex-1'>
        <Link to="/" className='btn btn-ghost text-2xl font-bold text-primary font-mono tracking-tight'>
          ThinkBoard
        </Link>
      </div>

      <div className='flex-none gap-2 items-center'>
        <ThemeToggle />
        {user ? (
          <>
            <Link to="/create-note" className="btn btn-primary btn-sm md:btn-md">
              <PlusIcon className='size-5' />
              <span className='hidden md:inline'>New Note</span>
            </Link>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {/* Read avatar_url from the global 'profile' object */}
                  <img 
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}`} 
                    alt="User profile avatar" 
                  />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className='p-2 font-semibold truncate'>{user.email}</li>
                <div className="divider my-0"></div>
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={signOut}>Logout</button></li>
              </ul>
            </div>
          </>
        ) : (
          <div className="space-x-2">
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;