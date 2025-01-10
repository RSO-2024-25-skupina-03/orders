import Order from "../models/orders.js";
import client from 'amqplib';

/**
 * RabbitMQ
 */

/**
 * @openapi
 * components:
 *  schemas:
 *   rabbitMQMessage:
 *    type: object
 *    description: A message to be sent to RabbitMQ
 *    properties:
 *     order_id:
 *      type: string
 *      description: The order ID
 *      example: "100000000000000000000000"
 *     buyer_id:
 *      type: string
 *      description: The buyer ID
 *      example: "000000000000000000000002"
 *     seller_id:
 *      type: string
 *      description: The seller ID
 *      example: "000000000000000000000001"
 *     time:
 *      type: string
 *      format: date-time
 *      description: The time the message was created
 */
const createMessage = (order_id, buyer_id, seller_id) => {
    return JSON.stringify({
        order_id: order_id,
        buyer_id: buyer_id,
        seller_id: seller_id,
        time: new Date().toISOString(),
    });
}
const sendMessage = async (queueName, message) => {
    let connection;
    try {
        connection = await client.connect(
            'amqp://guest:guest@rabbitmq:5672'
        );
    } catch (error) {
        console.error('Error connecting to RabbitMQ');
        console.error(error);
        await channel.close();
        return { status: 'error', type: 'Error connecting to RabbitMQ', message:  message };
    }

    try {
        const channel = await connection.createChannel();
        // Create a queue if it does not exist
        await channel.assertQueue(queueName);
        // Send message to queue
        await channel.sendToQueue(queueName, Buffer.from(message));
        // Close channel and connection
        await channel.close();
        await connection.close();
        return { status: 'success', type: 'success', message: message };
    } catch (error) {
        console.error('Error sending message to RabbitMQ');
        console.error(error);
        await channel.close();
        await connection.close();
        return { status: 'error', type: 'Error sending message to RabbitMQ', message: message };
    }
}


/**
 * @openapi
 * /checkout/{user_id}:
 *  post:
 *   summary: Checkout, create orders for all products in the cart and call stock service to update stock
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: user_id
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
 *   responses:
 *    '201':
 *     description: Order created successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         orders:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Order'
 *         messages:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *            status:
 *             type: string
 *             description: Status of the message
 *            type:
 *             type: string
 *             description: Type of the error/success
 *            message:
 *             $ref: '#/components/schemas/rabbitMQMessage'
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
        if (!req.params.user_id) {
            return res.status(400).json({ message: "user_id required" });
        }
        if (!req.body.address) {
            return res.status(400).json({ message: "address required" });
        }
        if (!req.body.cart) {
            return res.status(400).json({ message: "cart required" });
        }
        const orderList = [];
        const sentMessages = [];
        for (const item of req.body.cart) {
            const order = {
                type: "stocked",
                buyer_id: req.params.user_id,
                seller_id: item.seller_id,
                product_id: item.product_id,
                quantity: item.quantity,
                address: req.body.address,
                status: "pending",
            };
            const newOrder = await Order.create(order);
            const message = createMessage(newOrder._id, req.params.user_id, item.seller_id);
            const result = await sendMessage('order', message);
            sentMessages.push(result);
            orderList.push(newOrder);
        }
        res.status(201).json({orders: orderList, messages: sentMessages});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * @openapi
 * /order/{order_id}:
 *  get:
 *   summary: Get an order by ID
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: order_id
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
        const order = await Order.findById(req.params.order_id).exec();
        console.log(req.params.order_id);
        console.log(order);
        if (!order) {
            return res.status(404).json({
                "message": ("order with id" + req.params.order_id.toString() + "not found")
            });
        }
        res.status(200).json(order);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



/**
 * @openapi
 * /vendor_orders/{seller_id}:
 *  get:
 *   summary: Get orders by vendor ID
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: seller_id
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
        const orders = await Order.find({ seller_id: req.params.seller_id }).exec();
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
 * /buyer_orders/{buyer_id}:
 *  get:
 *   summary: Get orders by buyer ID
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: buyer_id
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
        const orders = await Order.find({ buyer_id: req.params.buyer_id }).exec();
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
 *   summary: Create a new order, send notification to rabbitMQ
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
 *        type: object
 *        properties:
 *         order:
 *          $ref: '#/components/schemas/Order'
 *         message:
 *          type: object
 *          properties:
 *           status:
 *            type: string
 *            description: Status of the message
 *           type:
 *            type: string
 *            description: Type of the error/success
 *           message:
 *            $ref: '#/components/schemas/rabbitMQMessage'
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
        if (!req.body.buyer_id || req.body.buyer_id.length !== 24) {
            return res.status(400).json({ message: "buyer_id required and must have 24 digits" });
        }
        if (!req.body.seller_id || req.body.seller_id.length !== 24) {
            return res.status(400).json({ message: "seller_id required and must have 24 digits" });
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
            buyer_id: req.body.buyer_id,
            seller_id: req.body.seller_id,
            name: req.body.name,
            quantity: req.body.quantity,
            address: req.body.address,
            status: req.body.status,
            type: req.body.type,
        }
        if (req.body.date) {
            newOrder.date = req.body.date;
        }
        if (req.body.product_id) {
            newOrder.product_id = req.body.product_id;
        }
        if (req.body.description) {
            newOrder.description = req.body.description;
        }
        if (req.body.price) {
            newOrder.price = req.body.price;
        }
        const order = await Order.create(newOrder);
        if (!order) {
            return res.status(400).json({ message: "order not created" });
        }
        const message = createMessage(order._id, req.body.buyer_id, req.body.seller_id);
        const result = await sendMessage('order', message);
        console.log(result);

        res.status(201).json({order: order, message: result});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * @openapi
 * /order/{order_id}:
 *  put:
 *   summary: Update an existing order
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: order_id
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
 *        type: object
 *        properties:
 *         order:
 *          $ref: '#/components/schemas/Order'
 *         message:
 *          type: object
 *          description: Message sent to RabbitMQ
 *          properties:
 *           status:
 *            type: string
 *            description: Status of the message
 *           type:
 *            type: string
 *            description: Type of the error/success
 *           message:
 *            $ref: '#/components/schemas/rabbitMQMessage'
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
        if (!req.params.order_id) {
            return res.status(404).json({
                "message": "order_id required"
            });
        }
        const order = await Order.findById(req.params.order_id).exec();
        if (!order) {
            return res.status(404).json({
                "message": "order_id not found"
            });
        }

        if (req.body.buyer_id) order.buyer_id = req.body.buyer_id;
        if (req.body.seller_id) order.seller_id = req.body.seller_id;
        if (req.body.product_id) order.product_id = req.body.product_id;
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
            const message = createMessage(savedOrder._id, savedOrder.buyer_id, savedOrder.seller_id);
            const result = await sendMessage('order', message);
            console.log(result);
            res.status(200).json({order: savedOrder, message: result});
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