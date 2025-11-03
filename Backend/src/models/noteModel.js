import { supabase } from "../config/supabaseClient.js";

// Create a new note
export const createNote = async (title, content) => {
  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content }])
    .select();
  if (error) throw error;
  return data[0];
};

// Get all notes
export const getNotes = async () => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Get a note by ID
export const getNoteById = async (id) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// Update a note
export const updateNote = async (id, title, content) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content, updated_at: new Date() })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

// Delete a note
export const deleteNote = async (id) => {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  return true;
};
