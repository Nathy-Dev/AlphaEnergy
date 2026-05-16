import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
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

  const fetchItems = useCallback(async () => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized. Please check your .env keys.");
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'portfolioItems'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as PortfolioItem[];
      setItems(data);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    const ref = await addDoc(collection(db, 'portfolioItems'), {
      ...item,
      createdAt: serverTimestamp()
    });
    await fetchItems();
    return ref;
  };

  const updateItem = async (id: string, updates: Partial<PortfolioItem>) => {
    const ref = doc(db, 'portfolioItems', id);
    await updateDoc(ref, updates);
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    const ref = doc(db, 'portfolioItems', id);
    await deleteDoc(ref);
    await fetchItems();
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
