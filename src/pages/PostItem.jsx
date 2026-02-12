import React, { useState, useContext } from 'react';
import ItemService from '../services/item.service';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PostItem = () => {
    const [items, setItems] = useState({
        title: '',
        description: '',
        type: 'LOST',
        category: 'Electronics',
        location: '',
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItems({ ...items, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setItems({ ...items, image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ItemService.createItem(items);
            navigate('/');
        } catch (error) {
            console.error("Error creating item:", error);
            alert("Failed to create item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Post a New Item</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={items.title}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Type</label>
                            <select
                                name="type"
                                value={items.type}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="LOST">Lost</option>
                                <option value="FOUND">Found</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Category</label>
                            <select
                                name="category"
                                value={items.category}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Books">Books</option>
                                <option value="Documents">Documents</option>
                                <option value="Keys">Keys</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={items.location}
                            onChange={handleChange}
                            placeholder="e.g. Library 2nd Floor"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={items.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {preview && (
                            <div className="mt-4">
                                <img src={preview} alt="Preview" className="h-48 object-cover rounded" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? 'Posting...' : 'Post Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostItem;
