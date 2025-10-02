import { useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc,
  Timestamp,
  collection 
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface UseFirebaseSyncOptions {
  createIfMissing?: boolean;
  backupBeforeOverwrite?: boolean;
}

export function useFirebaseSync<T>(
  collectionName: string, 
  documentId: string, 
  initialData: T,
  options: UseFirebaseSyncOptions = {}
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const { createIfMissing = false, backupBeforeOverwrite = false } = options;

  // Create backup before overwriting data
  const createBackup = useCallback(async (currentData: any) => {
    if (!backupBeforeOverwrite) return;
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDocId = `${documentId}-${timestamp}`;
      const backupRef = doc(db, `${collectionName}-backups`, backupDocId);
      
      await setDoc(backupRef, {
        originalData: currentData,
        backedUpAt: Timestamp.now(),
        originalDocumentId: documentId
      });
      
      console.log(`✅ Backup created: ${collectionName}-backups/${backupDocId}`);
    } catch (err) {
      console.error(`❌ Failed to create backup for ${collectionName}/${documentId}:`, err);
    }
  }, [collectionName, documentId, backupBeforeOverwrite]);

  // Double-check document existence before creating
  const safeCreateDocument = useCallback(async (dataToCreate: T) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      
      // Double-check with getDoc to avoid race conditions
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        console.log(`📄 Document already exists, skipping creation: ${collectionName}/${documentId}`);
        const existingData = docSnapshot.data();
        return existingData.value || initialData;
      }
      
      // Document truly doesn't exist, safe to create
      await setDoc(docRef, {
        value: dataToCreate,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      }, { merge: true });
      
      console.log(`📝 Document created safely: ${collectionName}/${documentId}`);
      return dataToCreate;
    } catch (err) {
      console.error(`❌ Error in safeCreateDocument for ${collectionName}/${documentId}:`, err);
      throw err;
    }
  }, [collectionName, documentId, initialData]);

  // Update data in Firebase with backup support
  const updateData = useCallback(async (newData: T) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      
      // Create backup if enabled
      if (backupBeforeOverwrite) {
        try {
          const currentDoc = await getDoc(docRef);
          if (currentDoc.exists()) {
            await createBackup(currentDoc.data());
          }
        } catch (backupErr) {
          console.warn(`⚠️ Backup failed but continuing with update: ${collectionName}/${documentId}`, backupErr);
        }
      }
      
      // Update with merge to preserve other fields
      await setDoc(docRef, {
        value: newData,
        lastUpdated: Timestamp.now()
      }, { merge: true });
      
      console.log(`✅ Data updated successfully: ${collectionName}/${documentId}`);
    } catch (err) {
      console.error(`❌ Error updating Firebase: ${collectionName}/${documentId}`, err);
      
      // Enhanced error handling
      if (err instanceof Error) {
        if (err.message.includes('permission-denied')) {
          setError('Permissão negada para atualizar dados');
          console.error('🚫 Permission denied - check Firestore security rules');
        } else if (err.message.includes('network')) {
          setError('Erro de rede - verifique sua conexão');
          console.error('🌐 Network error - check internet connection');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erro desconhecido ao atualizar dados');
      }
    }
  }, [collectionName, documentId, createBackup, backupBeforeOverwrite]);

  // Set up real-time listener
  useEffect(() => {
    console.log(`🔄 Setting up Firebase listener: ${collectionName}/${documentId}`);
    console.log(`📋 Options: createIfMissing=${createIfMissing}, backupBeforeOverwrite=${backupBeforeOverwrite}`);
    
    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        setLoading(false);
        setConnected(true);
        setError(null);
        
        if (docSnapshot.exists()) {
          const firebaseData = docSnapshot.data();
          const actualData = firebaseData.value || initialData;
          setData(actualData as T);
          console.log(`📥 Data received from Firebase: ${collectionName}/${documentId}`);
        } else {
          console.log(`📭 Document does not exist: ${collectionName}/${documentId}`);
          
          if (createIfMissing) {
            console.log(`🔧 createIfMissing=true, attempting to create document...`);
            safeCreateDocument(initialData)
              .then((createdData) => {
                setData(createdData as T);
              })
              .catch((err) => {
                console.error(`❌ Failed to create missing document: ${collectionName}/${documentId}`, err);
                setData(initialData);
                setError('Falha ao criar documento');
              });
          } else {
            console.log(`📋 createIfMissing=false, using initialData locally without creating document`);
            setData(initialData);
          }
        }
      },
      (err) => {
        console.error(`❌ Firebase listener error: ${collectionName}/${documentId}`, err);
        setConnected(false);
        setLoading(false);
        
        // Enhanced error handling for listener
        if (err.message.includes('permission-denied')) {
          setError('Permissão negada para acessar dados');
          console.error('🚫 Permission denied - check Firestore security rules');
        } else if (err.message.includes('network') || err.message.includes('offline')) {
          setError('Erro de rede - usando dados locais');
          console.error('🌐 Network/offline error - using local data');
        } else {
          setError(err.message);
        }
        
        // Fallback to initial data on error
        setData(initialData);
      }
    );

    return () => {
      console.log(`🔌 Disconnecting Firebase listener: ${collectionName}/${documentId}`);
      unsubscribe();
    };
  }, [collectionName, documentId, initialData, createIfMissing, safeCreateDocument]);

  return {
    data,
    updateData,
    loading,
    error,
    connected
  };
}
