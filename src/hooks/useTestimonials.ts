import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
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

  const fetchTestimonials = useCallback(async () => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized.");
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Testimonial[];
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const addTestimonial = async (item: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const ref = await addDoc(collection(db, 'testimonials'), {
      ...item,
      createdAt: serverTimestamp()
    });
    await fetchTestimonials();
    return ref;
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    const ref = doc(db, 'testimonials', id);
    await updateDoc(ref, updates);
    await fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    const ref = doc(db, 'testimonials', id);
    await deleteDoc(ref);
    await fetchTestimonials();
  };

  return { testimonials, loading, addTestimonial, updateTestimonial, deleteTestimonial };
}
