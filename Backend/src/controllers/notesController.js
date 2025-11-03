import { createClient } from '@supabase/supabase-js';

// Helper function to create a client that impersonates the user
const getSupabase = (token) => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY, // Use the public anon key
    { global: { headers: { Authorization: `Bearer ${token}` } } } // Pass the user's token
  );
};

export async function getAllNotes(req, res) {
  try {
    const supabase = getSupabase(req.token); // Create a user-specific client
    
    // RLS is automatically applied to this request
    const { data, error } = await supabase
        .from('notes')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message });
  }
}

export async function getSingleNote(req, res) {
  try {
    const supabase = getSupabase(req.token); // Use user-specific client
    const { id } = req.params;
    
    // RLS is automatically applied
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ message: 'Note not found (or no access)' });
    res.json(data);
  } catch (error) {
    console.error("Error fetching single note:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function createNote(req, res) {
  try {
    const supabase = getSupabase(req.token); // Use user-specific client
    const { title, content } = req.body;

    if (!title || !content || title.trim() === '') {
        return res.status(400).json({ message: "Title and content cannot be empty." });
    }
    
    // RLS policy "Users can insert their own notes." is applied
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content, user_id: req.user.id }]) // Pass user_id for the policy to check
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message });
  }
}

export async function updateNote(req, res) {
  try {
    const supabase = getSupabase(req.token); // Use user-specific client
    const { id } = req.params;
    const { title, content } = req.body;

    // RLS policy "Owners can update their own notes." is applied
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Note not found (or you are not the owner)' });
    res.json(data);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function deleteNote(req, res) {
  try {
    const supabase = getSupabase(req.token); // Use user-specific client
    const { id } = req.params;

    // RLS policy "Owners can delete their own notes." is applied
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getNoteMessages(req, res) {
  try {
    const supabase = getSupabase(req.token); // Use user-specific client
    const { id } = req.params;

    // RLS policy "Logged-in users can view messages." is applied
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('note_id', id)
        .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message });
  }
}

