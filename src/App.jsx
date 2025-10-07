import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import ViewInvoice from './pages/ViewInvoice';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout currentPageName="Landing"><Landing /></Layout>} />
        <Route path="/dashboard" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
        <Route path="/generator" element={<Layout currentPageName="Generator"><Generator /></Layout>} />
        <Route path="/view-invoice" element={<Layout currentPageName="ViewInvoice"><ViewInvoice /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
