import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBouquet, setEditingBouquet] = useState(null);
  const [showBouquetSelector, setShowBouquetSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    category: '',
    is_available: true,
    image: null
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchBouquets();
  }, []);

  const fetchBouquets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/bouquets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBouquets(data);
    } catch (error) {
      console.error('Error fetching bouquets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const url = editingBouquet 
      ? `http://localhost:3000/bouquets/${editingBouquet._id}`
      : 'http://localhost:3000/bouquets';
    
    const method = editingBouquet ? 'PUT' : 'POST';

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('base_price', parseFloat(formData.base_price));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('is_available', formData.is_available);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        fetchBouquets();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving bouquet:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bouquet?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/bouquets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchBouquets();
      }
    } catch (error) {
      console.error('Error deleting bouquet:', error);
    }
  };

  const openModal = (bouquet = null) => {
    if (bouquet) {
      setEditingBouquet(bouquet);
      setFormData({
        name: bouquet.name,
        description: bouquet.description,
        base_price: bouquet.base_price,
        category: bouquet.category,
        is_available: bouquet.is_available
      });
      setShowModal(true);
      setShowBouquetSelector(false);
    } else {
      setEditingBouquet(null);
      setFormData({
        name: '',
        description: '',
        base_price: '',
        category: '',
        is_available: true,
        image: null
      });
      setShowModal(true);
      setShowBouquetSelector(false);
    }
  };

  const openBouquetSelector = () => {
    setShowBouquetSelector(true);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBouquet(null);
    setShowBouquetSelector(false);
    setFormData({
      name: '',
      description: '',
      base_price: '',
      category: '',
      is_available: true,
      image: null
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage bouquets and inventory</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => openBouquetSelector()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <Edit size={20} />
              {showBouquetSelector ? 'Cancel' : 'Modify Bouquet'}
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <Plus size={20} />
              {showModal ? 'Cancel' : 'Add Bouquet'}
            </button>
          </div>
        </div>

        {/* Bouquet Selector for Editing */}
        {showBouquetSelector && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Bouquet to Modify</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bouquets.map((bouquet) => (
                <button
                  key={bouquet._id}
                  onClick={() => openModal(bouquet)}
                  className="p-4 border border-gray-300 rounded-lg hover:border-pink-500 hover:shadow-md transition text-left"
                >
                  <h3 className="font-semibold text-gray-800">{bouquet.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{bouquet.category}</p>
                  <p className="text-lg font-bold text-pink-600 mt-2">${bouquet.base_price}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                    bouquet.is_available 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {bouquet.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showModal && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingBouquet ? 'Edit Bouquet' : 'Add New Bouquet'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  {formData.image && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {formData.image.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Bouquets">Bouquets</option>
                    <option value="Arrangements">Arrangements</option>
                    <option value="Plants">Plants</option>
                    <option value="Orchid">Orchid</option>
                    <option value="Events">Events</option>
                    <option value="Weddings">Weddings</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Available for purchase</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition"
                >
                  {editingBouquet ? 'Update' : 'Create'} Bouquet
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{bouquets.length}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Package className="text-pink-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {bouquets.filter(b => b.is_available).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Categories</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {[...new Set(bouquets.map(b => b.category))].length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bouquets.map((bouquet) => (
                  <tr key={bouquet._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{bouquet.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{bouquet.description}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{bouquet.category}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">${bouquet.base_price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-sm rounded ${
                        bouquet.is_available
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {bouquet.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(bouquet)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(bouquet._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
