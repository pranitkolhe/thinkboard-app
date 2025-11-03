import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar.jsx'; // Use alias
import NoteCard from '@/components/NoteCard.jsx'; // Use alias
import NotesNotFound from '@/components/NotesNotFound.jsx'; // Use alias
import RateLimitesUI from '@/components/RateLimitesUI.jsx'; // Use alias
import api from '@/lib/axios.js'; // Use alias
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext.jsx'; // 1. Import useAuth

const HomePage = () => {
    // 2. Get user and global loading state from the context
    const { user, loading: authLoading } = useAuth(); 
    
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true); // This is now for the *notes fetch*
    const [isRateLimited, setIsRateLimited] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true); // Start notes-specific loading
            setIsRateLimited(false);
            try {
                const res = await api.get("/notes");
                setNotes(res.data);
            } catch (error) {
                if (error.response?.status === 429) {
                    setIsRateLimited(true);
                } else if (error.response?.status !== 401) { 
                    // Only show error if it's not a 401
                    toast.error("Failed to load notes.");
                }
            } finally {
                setLoading(false); // Stop notes-specific loading
            }
        };

        // 3. Check if auth is finished *and* if a user exists
        if (!authLoading) {
            if (user) {
                // If logged in, fetch notes
                fetchNotes();
            } else {
                // If not logged in, stop all loading
                setLoading(false); 
                setNotes([]);
            }
        }
    }, [user, authLoading]); // 4. Re-run this effect when auth state changes

    const renderContent = () => {
        if (isRateLimited) {
            return <RateLimitesUI />;
        }
        
        // 5. Show a spinner if *either* auth or notes are loading
        if (authLoading || loading) {
            return (
                <div className='text-center text-primary py-20'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            );
        }

        if (notes.length > 0) {
            return (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} setNotes={setNotes} />
                    ))}
                </div>
            );
        }

        // If not loading and no notes (this also covers the logged-out state)
        return <NotesNotFound />;
    };

    return (
        <div className='min-h-screen bg-base-200'>
            <Navbar />
            <main className='container mx-auto px-4 py-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-4xl font-bold'>Your Notes</h1>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default HomePage;
// import React, { useEffect, useState } from 'react'

// import Navbar from '../components/Navbar'
// import RateLimitesUI from '../components/RateLimitesUI'
// import toast from 'react-hot-toast';

// import NoteCard from '../components/NoteCard';
// import api from '../lib/axios';
// import NotesNotFound from '../components/NotesNotFound';

// const HomePage = () => {
//     const [isRateLimited, setIsRateLimited] = useState(false);
//     const [notes, setNotes] = useState([]);
//     const [loading, setLoading ] = useState(true);

//     useEffect(()=>{
//         const fetchNotes = async()=>{
//             try {
//                 const res = await api.get("/notes");
//                 console.log(res.data)
//                 setNotes(res.data);
//                 setIsRateLimited(false)
//             } catch (error) {
//                 console.log("Error fetching Notes");
//                 if(error.response?.status === 429){
//                      setIsRateLimited(true);
//                 } else{
//                     toast.error("Falid to load Notes")
//                 }
//             } finally{
//                 setLoading(false);
//             }
//         }
//         fetchNotes();
//     },[]);

//     return (
//     <div className='min-h-screen'>
        
//         < Navbar />
//         { isRateLimited && <RateLimitesUI/>}

//         <div className='max-w-7xl mx-auto p-4 mt-6'>
//             {loading && <div className='text-center text-primary py-10'> Loading Notes..... </div> }
            
//             {notes.length === 0  && !isRateLimited && < NotesNotFound />}

//             {notes.length > 0 && !isRateLimited &&(
//                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//                     {notes.map(note =>(
//                        <NoteCard key={note.id} note={ note } setNotes={setNotes}/>
//                     ))}
//                 </div>
//             )}
//         </div>

//     </div>
//   )
// }

// export default HomePage
