import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryForm from './InventoryForm';
import InventoryList from './InventoryList';

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/inventory');
            setInventory(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch inventory items.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (itemData) => {
        try {
            if (currentItem) {
                // Update existing item
                await axios.put(`/api/inventory/${currentItem.id}`, itemData);
            } else {
                // Create new item
                await axios.post('/api/inventory', itemData);
            }
            fetchInventory();
            setCurrentItem(null);
        } catch (err) {
            setError('Failed to save inventory item.');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/inventory/${id}`);
            fetchInventory();
        } catch (err) {
            setError('Failed to delete inventory item.');
            console.error(err);
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
    };

    return (
        <div className="container mt-4">
            <h1>Inventory Management</h1>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            {currentItem ? 'Edit Item' : 'Add New Item'}
                        </div>
                        <div className="card-body">
                            <InventoryForm 
                                initialData={currentItem}
                                onSave={handleSave}
                                onCancel={() => setCurrentItem(null)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Inventory Items</div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading inventory...</p>
                            ) : (
                                <InventoryList 
                                    items={inventory}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;