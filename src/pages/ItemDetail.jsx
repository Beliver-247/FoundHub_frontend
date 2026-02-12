import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ItemService from '../services/item.service';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

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

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [matchesLoading, setMatchesLoading] = useState(false);

    const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes('ADMIN');
    const isOwner = currentUser && item && item.postedBy && currentUser.id === item.postedBy.id;

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await ItemService.getItemById(id);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching item", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    // Fetch matches when item is loaded
    useEffect(() => {
        if (!item) return;
        const fetchMatches = async () => {
            setMatchesLoading(true);
            try {
                const response = await ItemService.getMatchesForItem(id);
                setMatches(response.data);
            } catch (error) {
                console.error("Error fetching matches", error);
            } finally {
                setMatchesLoading(false);
            }
        };

        fetchMatches();
    }, [item, id]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            const response = await ItemService.updateItemStatus(id, newStatus);
            setItem(response.data);
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status: " + (error.response?.data || error.message));
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await ItemService.deleteItem(id);
                navigate('/');
            } catch (error) {
                console.error("Error deleting item", error);
                alert("Failed to delete item");
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!item) return <div className="text-center py-10">Item not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-96 object-cover"
                        />
                    ) : (
                        <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image Available
                        </div>
                    )}
                </div>
                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                                <span className={`inline-block px-3 py-1 text-sm font-bold rounded mr-2 ${item.type === 'LOST' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                    }`}>
                                    {item.type}
                                </span>
                                <span className={`inline-block px-3 py-1 text-sm font-bold rounded ${statusStyles[item.status] || 'bg-gray-200 text-gray-700'
                                    }`}>
                                    {statusLabels[item.status] || item.status}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-gray-500 text-sm uppercase font-bold tracking-wide">Description</h3>
                            <p className="text-gray-700 mt-1">{item.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-gray-500 text-sm uppercase font-bold tracking-wide">Location</h3>
                                <p className="text-gray-800">{item.location}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm uppercase font-bold tracking-wide">Category</h3>
                                <p className="text-gray-800">{item.category}</p>
                            </div>
                            {/* Date: only shown if backend provides it (owner/admin only) */}
                            {item.date && (
                                <div>
                                    <h3 className="text-gray-500 text-sm uppercase font-bold tracking-wide">Date Posted</h3>
                                    <p className="text-gray-800">{format(new Date(item.date), 'PPP')}</p>
                                </div>
                            )}
                        </div>

                        {/* Keywords */}
                        {item.keywords && item.keywords.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-gray-500 text-sm uppercase font-bold tracking-wide mb-2">AI-Detected Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.keywords.map((keyword, index) => (
                                        <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact info: only shown if backend provides it (owner/admin only) */}
                        {item.postedBy && (
                            <div className="mb-6 bg-gray-50 p-4 rounded">
                                <h3 className="text-gray-500 text-sm uppercase font-bold tracking-wide mb-2">Posted By</h3>
                                <p className="font-semibold">{item.postedBy.name}</p>
                                {item.postedBy.contactInfo && (
                                    <p className="text-blue-600">{item.postedBy.contactInfo}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Admin actions */}
                    {isAdmin && (
                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-gray-700 font-bold mb-2">Admin Actions</h3>
                            <div className="flex flex-wrap gap-2">
                                {item.status === 'OPEN' && (
                                    <button
                                        onClick={() => handleStatusUpdate('RECEIVED_BY_ADMIN')}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        Mark as Received
                                    </button>
                                )}
                                {(item.status === 'OPEN' || item.status === 'RECEIVED_BY_ADMIN') && (
                                    <button
                                        onClick={() => handleStatusUpdate('CLAIMED')}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Mark as Claimed
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Delete Item
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Owner actions (delete only) */}
                    {isOwner && !isAdmin && (
                        <div className="border-t pt-4 mt-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete My Item
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Potential Matches Section */}
            {matches.length > 0 && (
                <div className="max-w-4xl mx-auto mt-8">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            🔍 Potential Matches
                        </h2>
                        <p className="text-gray-500 text-sm mb-4">
                            {item.type === 'LOST'
                                ? 'These found items might be yours!'
                                : 'Someone might be looking for this item!'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matches.map((match) => (
                                <Link
                                    key={match.item.id}
                                    to={`/item/${match.item.id}`}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden block"
                                >
                                    <div className="h-36 overflow-hidden bg-gray-200 relative">
                                        {match.item.imageUrl ? (
                                            <img
                                                src={match.item.imageUrl}
                                                alt={match.item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {Math.round(match.score * 100)}% match
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-sm truncate">{match.item.title}</h3>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {match.item.category} • {match.item.location}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {matchesLoading && (
                <div className="max-w-4xl mx-auto mt-8 text-center text-gray-500">
                    Finding potential matches...
                </div>
            )}
        </div>
    );
};

export default ItemDetail;
