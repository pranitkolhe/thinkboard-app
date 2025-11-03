import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';
import RateLimitesUI from '../components/RateLimitesUI';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const HomePage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRateLimited, setIsRateLimited] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            try {
                const res = await api.get("/notes");
                setNotes(res.data);
                setIsRateLimited(false);
            } catch (error) {
                if (error.response?.status === 429) {
                    setIsRateLimited(true);
                } else {
                    toast.error("Failed to load notes.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const renderContent = () => {
        if (isRateLimited) {
            return <RateLimitesUI />;
        }
        if (loading) {
            return <div className='text-center text-primary py-20'>Loading Notes...</div>;
        }

         {notes.length === 0  && !isRateLimited && < NotesNotFound />}   

        if (notes.length > 0) {
            return (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} setNotes={setNotes} />
                    ))}
                </div>
            );
        }
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
