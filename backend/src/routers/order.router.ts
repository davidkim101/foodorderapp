import { Router } from "express";
import asyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderStatus } from "../constants/order_status";
import { OrderModel } from "../models/order.model";
import authMid from "../middlewares/auth.mid";

const router = Router();

// use authentication middleware before creating an order
router.use(authMid);

router.post(
  "/create",
  asyncHandler(async (req: any, res: any) => {
    const requestOrder = req.body;

    if (requestOrder.items.lenght <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart Is Empty");
      return;
    }

    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);

router.get(
  "/newOrderForCurrentUser",
  asyncHandler(async (req: any, res) => {
    const order = await getNewOrderForCurrentUser(req);

    if (order) {
      res.send(order);
    } else {
      res.status(HTTP_BAD_REQUEST).send();
    }
  })
);

router.post(
  "/pay",
  asyncHandler(async (req: any, res: any) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);

    if (!order) {
      res.status(HTTP_BAD_REQUEST).send("Order Not Found!");
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
    // res.send(order.id);  --> can I use this since to virtuals is true in order.model.ts?
  })
);

router.get(
  "/track/:id",
  asyncHandler(async (req: any, res: any) => {
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
  })
);

export default router;

async function getNewOrderForCurrentUser(req: any) {
  return await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  });
}
