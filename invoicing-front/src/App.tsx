import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

// Address Pages
import AddressCreate from './pages/Address/AddressCreate';
import AddressGetAll from './pages/Address/AddressGetAll';
import AddressGetOne from './pages/Address/AddressGetOne';

// Customer Pages
import CustomerCreate from './pages/Customer/CustomerCreate';
import CustomerGetAll from './pages/Customer/CustomerGetAll';
import CustomerGetOne from './pages/Customer/CustomerGetOne';

// Invoice Pages
import InvoiceCreate from './pages/Invoice/InvoiceCreate';
import InvoiceGetAll from './pages/Invoice/InvoiceGetAll';
import InvoiceGetOne from './pages/Invoice/InvoiceGetOne';

// InvoiceItem Pages
import InvoiceItemCreate from './pages/InvoiceItem/InvoiceItemCreate';
import InvoiceItemGetAll from './pages/InvoiceItem/InvoiceItemGetAll';
import InvoiceItemGetOne from './pages/InvoiceItem/InvoiceItemGetOne';

import './App.css';

/**
 * Main App Component
 * Sets up routing with React Router and main layout
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Address Routes */}
        <Route
          path="/addresses/create"
          element={
            <MainLayout>
              <AddressCreate />
            </MainLayout>
          }
        />
        <Route
          path="/addresses/get-all"
          element={
            <MainLayout>
              <AddressGetAll />
            </MainLayout>
          }
        />
        <Route
          path="/addresses/get-one/:id"
          element={
            <MainLayout>
              <AddressGetOne />
            </MainLayout>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customers/create"
          element={
            <MainLayout>
              <CustomerCreate />
            </MainLayout>
          }
        />
        <Route
          path="/customers/get-all"
          element={
            <MainLayout>
              <CustomerGetAll />
            </MainLayout>
          }
        />
        <Route
          path="/customers/get-one/:id"
          element={
            <MainLayout>
              <CustomerGetOne />
            </MainLayout>
          }
        />

        {/* Invoice Routes */}
        <Route
          path="/invoices/create"
          element={
            <MainLayout>
              <InvoiceCreate />
            </MainLayout>
          }
        />
        <Route
          path="/invoices/get-all"
          element={
            <MainLayout>
              <InvoiceGetAll />
            </MainLayout>
          }
        />
        <Route
          path="/invoices/get-one/:id"
          element={
            <MainLayout>
              <InvoiceGetOne />
            </MainLayout>
          }
        />

        {/* InvoiceItem Routes */}
        <Route
          path="/invoice-items/create"
          element={
            <MainLayout>
              <InvoiceItemCreate />
            </MainLayout>
          }
        />
        <Route
          path="/invoice-items/get-all"
          element={
            <MainLayout>
              <InvoiceItemGetAll />
            </MainLayout>
          }
        />
        <Route
          path="/invoice-items/get-one/:id"
          element={
            <MainLayout>
              <InvoiceItemGetOne />
            </MainLayout>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/invoices/get-all" replace />} />
        <Route path="*" element={<Navigate to="/invoices/get-all" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
