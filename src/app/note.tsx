import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Field from '../components/Field';
import { useNotes } from '../context/NotesContext';
import { C, CATEGORIES } from '../theme';
         
// note creation and editing screen component handlng
export default function NoteScreen() {                                                                                              
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const existing = notes.find((n) => n.id === id);                                                                                                                                                                                                                                                                           