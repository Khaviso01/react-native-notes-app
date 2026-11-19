import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// The shape of a stored user (pass is the password HASH, never the real password)
export interface User { id: string; email: string; username: string; pass: string }

// Input payload for updating details
interface UpdateArgs { email: string; username: string; currentPassword: string; newPassword?: string }
