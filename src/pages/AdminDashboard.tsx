import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Users from './admin/Users';
import Events from './admin/Events';
import Photos from './admin/Photos';
import Sales from './admin/Sales';
import Settings from './admin/Settings';

const AdminDashboard = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="usuarios" element={<Users />} />
      <Route path="eventos" element={<Events />} />
      <Route path="fotos" element={<Photos />} />
      <Route path="vendas" element={<Sales />} />
      <Route path="configuracoes" element={<Settings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Route>
  </Routes>
);

export default AdminDashboard;
