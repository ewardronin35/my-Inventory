import React, { useState, useEffect } from 'react';

const InventoryForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: 0,
        price: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset form when switching from edit to create
            setFormData({
                name: '',
                quantity: 0,
                price: 0
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        // Reset form after submission
        if (!initialData) {
            setFormData({
                name: '',
                quantity: 0,
                price: 0
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Item Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Update' : 'Save'}
                </button>
                {initialData && (
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default InventoryForm;