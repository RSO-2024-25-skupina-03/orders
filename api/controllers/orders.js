import Order from "../models/orders.js";

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