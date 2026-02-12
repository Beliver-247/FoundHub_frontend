import React, { useState, useEffect } from 'react';
import ItemService from '../services/item.service';
import ItemCard from '../components/ItemCard';

const Home = () => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, [filter]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let response;
            if (filter === 'ALL') {
                response = await ItemService.getAllItems();
            } else {
                response = await ItemService.getItemsByType(filter);
            }
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Latest Items</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-lg ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('LOST')}
                        className={`px-4 py-2 rounded-lg ${filter === 'LOST' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Lost
                    </button>
                    <button
                        onClick={() => setFilter('FOUND')}
                        className={`px-4 py-2 rounded-lg ${filter === 'FOUND' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Found
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading items...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.length > 0 ? (
                        items.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No items found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
