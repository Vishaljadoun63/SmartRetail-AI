import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Trash2, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/dashboard/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/dashboard/customers/${id}`);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-gray-400">View and manage registered customers.</p>
        </div>
        <div className="relative w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search by name..." 
             className="input-field pl-10"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-primary">
            <Loader2 size={40} className="animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-medium text-gray-300">Name</th>
                <th className="p-4 font-medium text-gray-300">Visits</th>
                <th className="p-4 font-medium text-gray-300">Last Visit</th>
                <th className="p-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  key={c.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-medium flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary">
                      {c.name.charAt(0)}
                    </div>
                    {c.name}
                  </td>
                  <td className="p-4">
                    <span className="bg-white/10 px-2 py-1 rounded text-sm">{c.visit_count}</span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(c.last_visit).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => deleteCustomer(c.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
