import api from './api';

const getAllItems = () => {
    return api.get('/items');
};

const getItemsByType = (type) => {
    return api.get(`/items/type/${type}`);
};

const getItemById = (id) => {
    return api.get(`/items/${id}`);
};

const createItem = (itemData) => {
    const formData = new FormData();
    for (const key in itemData) {
        formData.append(key, itemData[key]);
    }
    return api.post('/items', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const updateItemStatus = (id, status) => {
    return api.put(`/items/${id}/status`, null, {
        params: { status }
    });
};

const deleteItem = (id) => {
    return api.delete(`/items/${id}`);
};

const getMatchesForItem = (id) => {
    return api.get(`/items/${id}/matches`);
};

const ItemService = {
    getAllItems,
    getItemsByType,
    getItemById,
    createItem,
    updateItemStatus,
    deleteItem,
    getMatchesForItem,
};

export default ItemService;
