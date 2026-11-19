import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Field from '../components/Field';
import { useNotes } from '../context/NotesContext';
import { C, CATEGORIES } from '../theme';

