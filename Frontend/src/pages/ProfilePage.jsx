import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { supabase } from '@/lib/supabase.js';
import toast from 'react-hot-toast';
import { UploadCloudIcon } from 'lucide-react';
import Navbar from '@/components/Navbar.jsx';

const ProfilePage = () => {
  const { user, profile, refetchProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // States for editable fields
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  
  // States for non-editable fields (will be set once from profile)
  const [name, setName] = useState('');
  const [prnNo, setPrnNo] = useState('');
  const [division, setDivision] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');

  // Note: We keep the departments array for the <select> to display correctly
  const departments = ['Computer Science', 'IT', 'ENTC', 'AIDS', 'CSAI', 'Mechanical'];

  useEffect(() => {
    if (profile) {
      // Set editable fields
      setUsername(profile.username || '');
      setPhone(profile.phone || '');
      
      // Set fixed fields
      setName(profile.name || '');
      setPrnNo(profile.prn_no || '');
      setDivision(profile.division || '');
      setYear(profile.year || '');
      setDepartment(profile.department || 'Computer Science');
    }
  }, [profile]);

  // Update handler now only sends editable fields
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updates = {
        id: user.id,
        username,
        phone,
        updated_at: new Date(),
      };
      // We only update username and phone
      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      toast.success('Profile updated successfully!');
      
      refetchProfile();
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };
  
  // Avatar upload logic remains the same
  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`;

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      
      refetchProfile();
      toast.success('Avatar updated!');

    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-base-200'>
      <Navbar />
      <div className="container mx-auto p-4 max-w-lg">
        <h1 className="text-4xl font-bold my-8">Your Profile</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">

            {/* --- AVATAR SECTION (Editable) --- */}
            <div className="flex items-center gap-4 mb-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`} alt="User Avatar" />
                </div>
              </div>
              <div>
                <label htmlFor="avatar-upload" className="btn btn-primary btn-sm">
                  <UploadCloudIcon className="size-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
                <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} className="hidden" />
              </div>
            </div>

            {/* --- PROFILE FORM --- */}
            <form onSubmit={handleUpdateProfile}>
              
              {/* --- Non-Editable Fields --- */}
              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Email</span></label>
                <input type="text" value={user?.email || ''} className="input input-bordered" disabled />
              </div>

              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input type="text" value={name} className="input input-bordered" disabled />
              </div>

              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Department</span></label>
                <select className="select select-bordered" value={department} disabled>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control mb-4">
                  <label className="label"><span className="label-text">Year</span></label>
                  <input type="number" value={year} className="input input-bordered" disabled />
                </div>
                <div className="form-control mb-4">
                  <label className="label"><span className="label-text">Division</span></label>
                  <input type="text" value={division} className="input input-bordered" disabled />
                </div>
              </div>

              <div className="form-control mb-4">
                <label className="label"><span className="label-text">PRN</span></label>
                <input type="text" value={prnNo} className="input input-bordered" disabled />
              </div>
              
              <div className="divider my-2">Editable Info</div>

              {/* --- Editable Fields --- */}
              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Username</span></label>
                <input type="text" placeholder="Your username" className="input input-bordered" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
              </div>

              <div className="form-control mb-4">
                <label className="label"><span className="label-text">Phone</span></label>
                <input type="tel" placeholder="Your phone number" className="input input-bordered" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
              </div>

              <div className="card-actions justify-end mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;