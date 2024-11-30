import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyerId: { type: String, required: [true, 'buyerId is required'] },
    sellerId: { type: String, required: [true, 'sellerId is required'] },
    name: { type: String, required: [true, 'name is required'] },
    price: { type: Number, required: [true, 'price is required'] },
    quantity: { type: Number, required: [true, 'quantity is required'] },
    date: { type: Date, "default": Date.now },
    address: { type: String, required: [true, 'address is required'] },
    status: { type: String, required: [true, 'status is required'] },
});


const Order = mongoose.model('Order', orderSchema, 'Orders');
export default Order;


const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name is required'] },
    email: { type: String, required: [true, 'email is required'] },
    password: { type: String, required: [true, 'password is required'] },
    role: {
        type: String, 
        required: [true, 'role is required'],
        enum: ['admin', 'user'],
    },
});

export const User = mongoose.model('User', userSchema, 'Users');