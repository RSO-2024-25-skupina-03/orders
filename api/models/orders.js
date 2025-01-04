import mongoose, { Mongoose } from 'mongoose';

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
 *        example: "000000000000000000000002"
 *      sellerId:
 *        type: string
 *        description: The seller's ID
 *        example: "000000000000000000000001"
 *      productId:
 *        type: string
 *        description: The product's ID
 *        example: "000000000000000000000003"
 *      description:
 *        type: string
 *        description: The description of the product
 *        example: "This is a product"
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
 *      type:
 *        type: string
 *        enum: [stocked, custom]
 *        description: The type of the order
 *    required:
 *      - buyerId
 *      - sellerId
 *      - quantity
 *      - address
 *      - status
 *      - type
 */

const orderSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: [true, 'type is required'],
        enum: ['stocked', 'custom'],
    },
    buyerId: { type: String, required: [true, 'buyerId is required'] },
    sellerId: { type: String, required: [true, 'sellerId is required'] },
    productId: { type: String },
    description: { type: String },
    price: { type: Number },
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