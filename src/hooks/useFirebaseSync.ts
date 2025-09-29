import { useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useFirebaseSync<T>(
  collectionName: string, 
  documentId: string, 
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Update data in Firebase
  const updateData = useCallback(async (newData: T) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, {
        ...newData,
        lastUpdated: Timestamp.now()
      }, { merge: true });
      console.log(`✅ Data updated in Firebase: ${collectionName}/${documentId}`);
    } catch (err) {
      console.error(`❌ Error updating Firebase: ${collectionName}/${documentId}`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [collectionName, documentId]);

  // Set up real-time listener
  useEffect(() => {
    console.log(`🔄 Setting up Firebase listener: ${collectionName}/${documentId}`);
    
    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        setLoading(false);
        setConnected(true);
        setError(null);
        
        if (docSnapshot.exists()) {
          const firebaseData = docSnapshot.data();
          // Remove Firebase metadata before setting data
          const { lastUpdated, ...cleanData } = firebaseData;
          setData(cleanData as T);
          console.log(`📥 Data received from Firebase: ${collectionName}/${documentId}`);
        } else {
          // Document doesn't exist, create it with initial data
          console.log(`📝 Creating initial document: ${collectionName}/${documentId}`);
          setDoc(docRef, {
            ...initialData,
            lastUpdated: Timestamp.now()
          });
          setData(initialData);
        }
      },
      (err) => {
        console.error(`❌ Firebase listener error: ${collectionName}/${documentId}`, err);
        setError(err.message);
        setConnected(false);
        setLoading(false);
        // Fallback to initial data on error
        setData(initialData);
      }
    );

    return () => {
      console.log(`🔌 Disconnecting Firebase listener: ${collectionName}/${documentId}`);
      unsubscribe();
    };
  }, [collectionName, documentId, initialData]);

  return {
    data,
    updateData,
    loading,
    error,
    connected
  };
}