import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ItemService from '../services/item.service';
import { AuthContext } from '../context/AuthContext';

const statusStyles = {
    OPEN: 'bg-blue-100 text-blue-800',
    RECEIVED_BY_ADMIN: 'bg-yellow-100 text-yellow-800',
    CLAIMED: 'bg-gray-800 text-white',
    RESOLVED: 'bg-green-100 text-green-800',
};

const statusLabels = {
    OPEN: 'Open',
    RECEIVED_BY_ADMIN: 'Received by Admin',
    CLAIMED: 'Claimed',
    RESOLVED: 'Resolved',
};

const AdminDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');

    const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes('ADMIN');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchItems();
    }, [isAdmin, navigate]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await ItemService.getAllItems();
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (itemId, newStatus) => {
        try {
            await ItemService.updateItemStatus(itemId, newStatus);
            fetchItems(); // Refresh the list
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status: " + (error.response?.data || error.message));
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await ItemService.deleteItem(itemId);
                fetchItems();
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item");
            }
        }
    };

    // Apply filters
    const filteredItems = items.filter(item => {
        if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
        if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
        return true;
    });

    // Stats
    const stats = {
        total: items.length,
        open: items.filter(i => i.status === 'OPEN').length,
        received: items.filter(i => i.status === 'RECEIVED_BY_ADMIN').length,
        claimed: items.filter(i => i.status === 'CLAIMED').length,
    };

    if (!isAdmin) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm uppercase">Total Items</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-400">
                    <p className="text-gray-500 text-sm uppercase">Open</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-400">
                    <p className="text-gray-500 text-sm uppercase">With Admin</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.received}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm uppercase">Claimed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.claimed}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
                <span className="text-gray-600 font-semibold">Filters:</span>
                <div className="flex gap-2">
                    <span className="text-gray-500 text-sm self-center">Status:</span>
                    {['ALL', 'OPEN', 'RECEIVED_BY_ADMIN', 'CLAIMED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 rounded text-sm ${statusFilter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {status === 'ALL' ? 'All' : statusLabels[status] || status}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-500 text-sm self-center">Type:</span>
                    {['ALL', 'LOST', 'FOUND'].map(type => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-3 py-1 rounded text-sm ${typeFilter === type
                                ? (type === 'LOST' ? 'bg-red-500 text-white' : type === 'FOUND' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white')
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {type === 'ALL' ? 'All' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Table */}
            {loading ? (
                <div className="text-center py-10">Loading items...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-600">Image</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Title</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Type</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Location</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Posted By</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                                        N/A
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Link to={`/item/${item.id}`} className="text-blue-600 hover:underline font-medium">
                                                    {item.title}
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'LOST' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600">{item.category}</td>
                                            <td className="p-4 text-gray-600">{item.location}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${statusStyles[item.status] || ''}`}>
                                                    {statusLabels[item.status] || item.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600 text-xs">
                                                {item.postedBy ? item.postedBy.name : '—'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {item.status === 'OPEN' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(item.id, 'RECEIVED_BY_ADMIN')}
                                                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                                                        >
                                                            Receive
                                                        </button>
                                                    )}
                                                    {(item.status === 'OPEN' || item.status === 'RECEIVED_BY_ADMIN') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(item.id, 'CLAIMED')}
                                                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                                        >
                                                            Claim
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-8 text-center text-gray-500">
                                            No items match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
