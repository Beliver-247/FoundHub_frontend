import React from 'react';
import { Link } from 'react-router-dom';

const statusStyles = {
    OPEN: 'bg-blue-100 text-blue-800',
    RECEIVED_BY_ADMIN: 'bg-yellow-100 text-yellow-800',
    CLAIMED: 'bg-gray-800 text-white',
    RESOLVED: 'bg-green-100 text-green-800',
};

const statusLabels = {
    OPEN: 'Open',
    RECEIVED_BY_ADMIN: 'With Admin',
    CLAIMED: 'Claimed',
    RESOLVED: 'Resolved',
};

const ItemCard = ({ item }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden bg-gray-200 relative">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}
                <div className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs font-bold uppercase rounded ${item.type === 'LOST' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                    {item.type}
                </div>
                <div className={`absolute top-0 left-0 m-2 px-2 py-1 text-xs font-bold uppercase rounded ${statusStyles[item.status] || 'bg-gray-200 text-gray-700'
                    }`}>
                    {statusLabels[item.status] || item.status}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 truncate">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.category} • {item.location}</p>
                <Link
                    to={`/item/${item.id}`}
                    className="block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ItemCard;
