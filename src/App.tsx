import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

import Auth from './pages/Auth'; 
import Index from './pages/index';

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Index />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;