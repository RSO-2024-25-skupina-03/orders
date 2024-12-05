import Order from "../models/orders.js";

/**
 * @openapi
 * /orders/{orderId}:
 *  get:
 *   summary: Get an order by ID
 *  tags: [Order]
 *  parameters:
 *    - in: path
 *      name: orderId
 *      schema:
 *        type: string
 *      required: true
 *      description: Order ID
 *  responses:
 *   '200':
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Order'
 *   '404':
 *     description: Order not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *   '500':
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const orderReadOne = (req, res) => {
    try {
        Order.findById(req.params.orderId)
            .exec((err, order) => {
                if (!order) {
                    return res.status(404).json({
                        "message": (req.params.orderId.toString() + "order not found")
                    });
                } else if (err) {
                    return res.status(404).json(err);
                }
                res.status(200).json(order);
            });
    }catch(err){
        res.status(500).json({message: err.message});
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

/**
 * @openapi
 * /order:
 *  post:
 *   summary: Create a new order
 *   tags: [Order]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
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

const vendorOrders = (req, res) => {
    try {
        Order.find({ vendor: req.params.vendorId })
            .exec((err, orders) => {
                if (!orders) {
                    return res.status(404).json({
                        "message": "vendor orders not found"
                    });
                } else if (err) {
                    return res.status(404).json(err);
                }
                res.status(200).json(orders);
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const buyerOrders = (req, res) => {
    try {
        Order.find({ buyer: req.params.buyerId })
            .exec((err, orders) => {
                if (!orders) {
                    return res.status(404).json({
                        "message": "buyer orders not found"
                    });
                } else if (err) {
                    return res.status(404).json(err);
                }
                res.status(200).json(orders);
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



const orderCreate = async (req, res) => {
    try {
        const order = await Order.create({
            buyerId: req.body.buyer,
            sellerId: req.body.vendor,
            name: req.body.products,
            price: req.body.total,
            quantity: req.body.quantity,
            date: req.body.date,
            address: req.body.address,
            status: req.body.status
        });
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json(err);
    }
}

const orderUpdateOne = (req, res) => {
    try {
        if (!req.params.orderId) {
            return res.status(404).json({
                "message": "orderId required"
            });
        }
        Order.findById(req.params.orderId)
            .exec((err, order) => {
                if (!order) {
                    return res.status(404).json({
                        "message": "orderId not found"
                    });
                } else if (err) {
                    return res.status(404).json(err);
                }
                order.buyer = req.body.buyer;
                order.vendor = req.body.vendor;
                order.products = req.body.products;
                order.total = req.body.total;
                order.save((err, order) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        res.status(200).json(order);
                    }
                });
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default {
    orderReadOne,
    vendorOrders,
    buyerOrders,
    orderCreate,
    orderUpdateOne
};