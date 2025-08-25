import React from 'react';

const InventoryList = ({ items, onEdit, onDelete }) => {
    if (items.length === 0) {
        return <p>No inventory items found. Add some items to get started.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>${parseFloat(item.price).toFixed(2)}</td>
                            <td>${(item.quantity * item.price).toFixed(2)}</td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => onEdit(item)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this item?')) {
                                            onDelete(item.id);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan="4">Total Inventory Value:</th>
                        <th>
                            ${items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)}
                        </th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default InventoryList;