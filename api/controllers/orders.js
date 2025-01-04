import Order from "../models/orders.js";

/**
 * @openapi
 * /checkout/{userId}:
 *  post:
 *   summary: Checkout, create orders for all products in the cart and call stock service to update stock
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: userId
 *      schema:
 *        type: string
 *      required: true
 *      description: User ID
 *      example: "000000000000000000000002"
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        address:
 *         type: string
 *         description: The address of the order delivery
 *         example: "123 Main St, New York, NY 10001"
 *        cart:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           productId:
 *            type: string
 *            description: The product ID
 *            example: "000000000000000000000001"
 *           quantity:
 *            type: number
 *            description: The quantity of the product
 *            example: 2
 *   responses:
 *    '201':
 *     description: Order created successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Order'
 *    '400':
 *     description: Bad request
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */

const checkout = async (req, res) => {
    try {
        if (!req.params.userId) {
            return res.status(400).json({ message: "userId required" });
        }
        if (!req.body.address) {
            return res.status(400).json({ message: "address required" });
        }
        if (!req.body.cart) {
            return res.status(400).json({ message: "cart required" });
        }
        const orderList = [];
        for (const item of req.body.cart) {
            const order = {
                type: "stocked",
                buyerId: req.params.userId,
                sellerId: item.sellerId,
                productId: item.productId,
                quantity: item.quantity,
                address: req.body.address,
                status: "pending",
            };
            const newOrder = await Order.create(order);
            orderList.push(newOrder);
        }
        res.status(201).json(orderList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * @openapi
 * /order/{orderId}:
 *  get:
 *   summary: Get an order by ID
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: orderId
 *      schema:
 *        type: string
 *      required: true
 *      description: Order ID
 *      example: "100000000000000000000000"
 *   responses:
 *    '200':
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Order'
 *    '404':
 *     description: Order not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const orderReadOne = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).exec();
        console.log(req.params.orderId);
        console.log(order);
        if (!order) {
            return res.status(404).json({
                "message": ("order with id" + req.params.orderId.toString() + "not found")
            });
        }
        res.status(200).json(order);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



/**
 * @openapi
 * /vendor_orders/{vendorId}:
 *  get:
 *   summary: Get orders by vendor ID
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: vendorId
 *      schema:
 *        type: string
 *      required: true
 *      description: Vendor ID
 *      example: "000000000000000000000001"
 *   responses:
 *    '200':
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Order'
 *    '404':
 *     description: Vendor orders not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const vendorOrders = async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.params.vendorId }).exec();
        if (!orders) {
            return res.status(404).json({
                "message": "vendor orders not found"
            });
        }
        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


/**
 * @openapi
 * /buyer_orders/{buyerId}:
 *  get:
 *   summary: Get orders by buyer ID
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: buyerId
 *      schema:
 *        type: string
 *      required: true
 *      description: Buyer ID
 *      example: "000000000000000000000002"
 *   responses:
 *    '200':
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Order'
 *    '404':
 *     description: Buyer orders not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const buyerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyerId: req.params.buyerId }).exec();
        if (!orders) {
            return res.status(404).json({
                "message": "buyer orders not found"
            });
        }
        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


/**
 * @openapi
 * /order:
 *  post:
 *   summary: Create a new order
 *   tags: [Order]
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       $ref: '#/components/schemas/Order'
 *   responses:
 *    '201':
 *     description: Order created successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Order'
 *    '400':
 *     description: Bad request
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const orderCreate = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.buyerId || req.body.buyerId.length !== 24) {
            return res.status(400).json({ message: "buyerId required and must have 24 digits" });
        }
        if (!req.body.sellerId || req.body.sellerId.length !== 24) {
            return res.status(400).json({ message: "sellerId required and must have 24 digits" });
        }
        if (!req.body.quantity) {
            return res.status(400).json({ message: "quantity required" });
        }
        if (!req.body.address) {
            return res.status(400).json({ message: "address required" });
        }
        if (!req.body.status) {
            return res.status(400).json({ message: "status required" });
        }
        if (!req.body.type) {
            return res.status(400).json({ message: "type required" });
        }

        const newOrder = {
            buyerId: req.body.buyerId,
            sellerId: req.body.sellerId,
            name: req.body.name,
            quantity: req.body.quantity,
            address: req.body.address,
            status: req.body.status,
            type: req.body.type,
        }
        if (req.body.date) {
            newOrder.date = req.body.date;
        }
        if (req.body.productId) {
            newOrder.productId = req.body.productId;
        }
        if (req.body.description) {
            newOrder.description = req.body.description;
        }
        if (req.body.price) {
            newOrder.price = req.body.price;
        }
        const order = await Order.create(newOrder);
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * @openapi
 * /order/{orderId}:
 *  put:
 *   summary: Update an existing order
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: orderId
 *      schema:
 *        type: string
 *      required: true
 *      description: Order ID
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Order'
 *   responses:
 *    '200':
 *     description: Order updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Order'
 *    '404':
 *     description: Order not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '400':
 *     description: Bad request
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const orderUpdateOne = async (req, res) => {
    try {
        if (!req.params.orderId) {
            return res.status(404).json({
                "message": "orderId required"
            });
        }
        const order = await Order.findById(req.params.orderId).exec();
        if (!order) {
            return res.status(404).json({
                "message": "orderId not found"
            });
        }

        if (req.body.buyerId) order.buyerId = req.body.buyerId;
        if (req.body.sellerId) order.sellerId = req.body.sellerId;
        if (req.body.productId) order.productId = req.body.productId;
        if (req.body.description) order.description = req.body.description;
        if (req.body.price) order.price = req.body.price;
        if (req.body.quantity) order.quantity = req.body.quantity;
        if (req.body.date) order.date = req.body.date
        if (req.body.address) order.address = req.body.address;
        if (req.body.status) order.status = req.body.status;

        const savedOrder = await order.save();
        if (!savedOrder) {
            return res.status(400).json({ message: "order not updated" });
        } else {
            res.status(200).json(savedOrder);
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default {
    orderReadOne,
    vendorOrders,
    buyerOrders,
    orderCreate,
    orderUpdateOne,
    checkout
};