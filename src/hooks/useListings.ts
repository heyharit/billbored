import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Listing } from '../types';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('currentPrice', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Listing[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Listing);
      });
      // Add ranks dynamically based on price
      const rankedData = data.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
      setListings(rankedData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching listings: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { listings, loading };
};
