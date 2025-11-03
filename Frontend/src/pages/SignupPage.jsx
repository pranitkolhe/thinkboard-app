import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx'; // Use alias
import toast from 'react-hot-toast';

const SignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State for all form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [prnNo, setPrnNo] = useState('');
  const [division, setDivision] = useState('');
  const [year, setYear] = useState('1');
  const [department, setDepartment] = useState('Computer Science');

  // Department options for the dropdown
  const departments = [
    'Computer Science', 'IT', 'ENTC', 'AIDS', 'CSAI', 'Mechanical'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@vit.edu')) {
      toast.error('Only emails from @vit.edu are allowed.');
      return;
    }

    setLoading(true);
    try {
      // Pass all the new data in the 'options.data' object
      // This data will be stored in 'raw_user_meta_data'
      const { error } = await signUp({
        email,
        password,
        options: {
          data: {
            name, phone, prn_no: prnNo, division, year, department
          }
        }
      });

      if (error) throw error;
      toast.success('Success! Check your email for the verification link.');
      navigate('/login');

    } catch (error) {
      toast.error(error.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md shrink-0 shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl">Create an Account</h2>
          
          <div className="form-control">
            <label className="label"><span className="label-text">Full Name</span></label>
            <input type="text" placeholder="Full Name" className="input input-bordered" required
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">VIT Email</span></label>
            <input type="email" placeholder="your-email@vit.edu" className="input input-bordered" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <input type="password" placeholder="Min. 6 characters" className="input input-bordered" required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Department</span></label>
            <select className="select select-bordered" value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Year</span></label>
              <input type="number" placeholder="Year (1-4)" className="input input-bordered" required min={1} max={4}
                value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Division</span></label>
              <input type="text" placeholder="Division (e.g., A, B)" className="input input-bordered" required
                value={division} onChange={(e) => setDivision(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">PRN</span></label>
              <input type="text" placeholder="PRN" className="input input-bordered"
                value={prnNo} onChange={(e) => setPrnNo(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Phone</span></label>
              <input type="tel" placeholder="Phone Number" className="input input-bordered"
                value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Sign Up'}
            </button>
          </div>
          <p className="text-center mt-4 text-sm">
            Already have an account? <Link to="/login" className="link link-primary">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;