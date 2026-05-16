import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
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

    const q = query(collection(db, 'portfolioItems'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioItem[];
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
    return await updateDoc(ref, updates);
  };

  const deleteItem = async (id: string) => {
    const ref = doc(db, 'portfolioItems', id);
    return await deleteDoc(ref);
  };

  return { items, loading, addItem, updateItem, deleteItem };
}
