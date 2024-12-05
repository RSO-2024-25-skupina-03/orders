import mongoose from 'mongoose';

/**
 * @openapi
 * components:
 *  schemas:
 *   Order:
 *    type: object
 *    description: An order
 *    properties:
 *      buyerId:
 *        type: string
 *        description: The buyer's ID
 *      sellerId:
 *        type: string
 *        description: The seller's ID
 *      name:
 *        type: string
 *        description: The name of the product
 *      price:
 *        type: number
 *        description: The price of the product
 *      quantity:
 *        type: number
 *        description: The quantity of the product
 *      date:
 *        type: string
 *        format: date
 *        description: The date of the order
 *      address:
 *        type: string
 *        description: The address of the order delivery
 *      status:
 *        type: string
 *        enum: [pending, accepted, completed, cancelled]
 *        description: The status of the order
 *    required:
 *      - buyerId
 *      - sellerId
 *      - name
 *      - price
 *      - quantity
 *      - address
 *      - status
 */

const orderSchema = new mongoose.Schema({
    buyerId: { type: String, required: [true, 'buyerId is required'] },
    sellerId: { type: String, required: [true, 'sellerId is required'] },
    name: { type: String, required: [true, 'name is required'] },
    price: { type: Number, required: [true, 'price is required'] },
    quantity: { type: Number, required: [true, 'quantity is required'] },
    date: { type: Date, "default": Date.now },
    address: { type: String, required: [true, 'address is required'] },
    status: { 
        type: String, 
        required: [true, 'status is required'],
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
    },
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