import React from 'react';
import { Wifi, WifiOff, Loader } from 'lucide-react';

interface FirebaseStatusProps {
  connected: boolean;
  loading: boolean;
  error: string | null;
}

export default function FirebaseStatus({ connected, loading, error }: FirebaseStatusProps) {
  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg z-50">
        <Loader className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-50" title={`Erro: ${error}`}>
        <WifiOff className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 p-2 rounded-full shadow-lg z-50 ${
      connected ? 'bg-green-500' : 'bg-red-500'
    } text-white`} title={connected ? 'Conectado ao Firebase' : 'Desconectado'}>
      {connected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
    </div>
  );
}