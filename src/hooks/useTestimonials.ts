import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Testimonial {
  id?: string;
  name: string;
  portfolio: string;
  testimonial: string;
  rating: number;
  createdAt?: any;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized.");
      setLoading(false);
      return;
    }

    // Remove orderBy from server-side to avoid issues with null fields (optimistic updates)
    // and missing indexes. We will sort on the client instead.
    const q = query(collection(db, 'testimonials'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Testimonial[];
      
      // Sort on client: newest first
      // Handle cases where createdAt might be null (optimistic) or a Firestore Timestamp
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || Date.now();
        const timeB = b.createdAt?.toMillis?.() || Date.now();
        return timeB - timeA;
      });

      setTestimonials(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching testimonials:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTestimonial = async (item: Omit<Testimonial, 'id' | 'createdAt'>) => {
    return await addDoc(collection(db, 'testimonials'), {
      ...item,
      createdAt: serverTimestamp()
    });
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    const ref = doc(db, 'testimonials', id);
    await updateDoc(ref, updates);
  };

  const deleteTestimonial = async (id: string) => {
    const ref = doc(db, 'testimonials', id);
    await deleteDoc(ref);
  };

  return { testimonials, loading, addTestimonial, updateTestimonial, deleteTestimonial };
}
