import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  location: string;
  tag: 'Residential' | 'Commercial' | 'Industrial';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  createdAt?: any;
}

export function usePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized. Please check your .env keys.");
      setLoading(false);
      return;
    }

    // Sort on client to avoid missing index issues and optimistic update exclusions
    const q = query(collection(db, 'portfolioItems'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as PortfolioItem[];

      // Client-side sort: newest first
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || Date.now();
        const timeB = b.createdAt?.toMillis?.() || Date.now();
        return timeB - timeA;
      });

      setItems(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching portfolio items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    return await addDoc(collection(db, 'portfolioItems'), {
      ...item,
      createdAt: serverTimestamp()
    });
  };

  const updateItem = async (id: string, updates: Partial<PortfolioItem>) => {
    const ref = doc(db, 'portfolioItems', id);
    await updateDoc(ref, updates);
  };

  const deleteItem = async (id: string) => {
    const ref = doc(db, 'portfolioItems', id);
    await deleteDoc(ref);
  };

  return { items, loading, addItem, updateItem, deleteItem };
}

export function usePortfolioActions() {
  const addItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    return await addDoc(collection(db, 'portfolioItems'), {
      ...item,
      createdAt: serverTimestamp()
    });
  };

  const updateItem = async (id: string, updates: Partial<PortfolioItem>) => {
    const ref = doc(db, 'portfolioItems', id);
    return await updateDoc(ref, updates);
  };

  return { addItem, updateItem };
}
