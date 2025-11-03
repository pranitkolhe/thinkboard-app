import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import Navbar from '../components/Navbar';

const CreatePage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      api.get(`/notes/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch(() => {
          toast.error("Could not load note. You may not be the owner.");
          navigate("/");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setLoading(true);
    try {
      if (isEditMode) {
        await api.patch(`/notes/${id}`, { title, content });
        toast.success("Note Updated Successfully!");
      } else {
        await api.post("/notes", { title, content });
        toast.success("Note Created Successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} note.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-base-200'>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className='size-5 mr-2' /> Back
          </Link>
          <div className="card bg-base-100 shadow-xl">
            <div className='card-body'>
              <h2 className="card-title text-2xl mb-4">{isEditMode ? 'Edit Note' : 'Create New Note'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className='label'><span className='label-text'>Title</span></label>
                  <input type="text" placeholder='Note Title' className='input input-bordered mt-2' value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-control mb-4">
                  <label className='label'><span className='label-text'>Content</span></label>
                  <textarea placeholder='Note Content' className='textarea textarea-bordered mt-2 h-48' value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <div className="card-actions justify-end">
                  <button type='submit' className='btn btn-primary' disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : (isEditMode ? 'Update Note' : 'Create Note')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default CreatePage;


// import React, { useState } from 'react'
// import { ArrowLeftIcon } from 'lucide-react';
// import { Link, useNavigate } from 'react-router';
// import toast from 'react-hot-toast';
// import api from '../lib/axios';

// const CreatePage = () => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e)=>{
//       e.preventDefault();

//       if(!title.trim() || !content.trim()){
//         toast.error("All fields are required");
//         return; 
//       }

//       setLoading(true)

//       try {
//         await api.post("/notes",{
//             title,
//             content,
//         })
//         toast.success("Note Created Successfully!");
//         navigate("/");
//       } catch (error) {
//         console.log("Error creating note",error);
//         if(error.response.status === 429 ){
//           toast.error("Solw Down!! You're creating notes too fast",{
//             duration:4000,
//             icon:"👻",
//           })
//         }else{
//          toast.error("Failed to create Note");
//         }
//       } finally {
//           setLoading(false);
//       }
//   }

//   return ( 
//     <div className='min-h-screen bg-base-200'>
//         <div className='container mx-auto px-4 py-8'>
//             <div className='max-w-2xl mx-auto'>

//               <Link to={"/"} className="btn btn-ghost mb-6">
//                 <ArrowLeftIcon className='size-5' />
//               </Link>

//               <div className="card bg-base-100">
//                 <div className='card-body'>
//                   <h2 className="card-title text-2xl mb-4">Create New Note</h2>
//                   <form onSubmit={handleSubmit}>
                    
//                     <div className="form-control mb-4">
//                       <label className='lable'>
//                         <span className='lable-text'>Title</span>
//                       </label>
//                       <input type="text" placeholder='Note Title' className='input input-bordered mt-3' value={title} onChange={(e)=> setTitle(e.target.value)}  />
//                     </div>

//                     <div className="form-control mb-4">
//                       <label className='lable'>
//                         <span className='lable-text'>Content</span>
//                       </label>
//                       <textarea type="text" placeholder='Note Content' className='input input-bordered mt-3' value={content} onChange={(e)=> setContent(e.target.value)}  />
//                     </div>

//                     <div className="card-actions justify-end">
//                       <button type='submit' className='btn btn-primary' disabled={loading}>
//                         {loading ? "Creating..." : "Create Note"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>

//               </div>

//             </div>

//         </div>
//     </div>
//   )
  
// }
// export default CreatePage
