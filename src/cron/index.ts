import type { Request, Response } from "express";
import { config } from "../lib/config.js";

const products = [
  { id: "f069a6ae-74cf-4255-9db2-be2be9edf7fb", price: 22000 },
  { id: "3b765e6c-cb4d-41b2-b4c6-a016dd019f39", price: 22000 },
  { id: "4580e8c4-b517-4140-8b83-6b084e45059f", price: 18000 },
  { id: "45156fde-6eae-46c3-b1f3-c24ad253cfc7", price: 26000 },
  { id: "966329d9-dd59-49dd-9918-29f622395b4b", price: 26000 },
  { id: "ba2eb5ea-6f23-44ce-9741-7aa90bb71ef2", price: 22000 },
  { id: "75ab575e-7f31-4c1b-92d2-6ed9e1f77fc2", price: 22000 },
  { id: "b8e126e5-745a-4642-9054-9ab553be8dfe", price: 18000 },
  { id: "75458f4a-d615-4cb6-974e-70376fa658d2", price: 18000 },
  { id: "32bee00f-0595-4766-935f-af838a209f29", price: 18000 },
  { id: "83c45b22-3244-492f-8923-757362750645", price: 42000 },
  { id: "c0ba8bb4-611d-492b-8914-6ba54fd39578", price: 38000 },
  { id: "c863cce5-043b-4ef3-bade-c52dc0140c1c", price: 28000 },
  { id: "2408b74d-0ddd-44e4-afd4-763f8ec52ded", price: 26000 },
];

const paymentMethods = ["CASH", "QRIS", "DEBIT"];
const orderTypes = ["TAKE_AWAY", "DINE_IN"];
const channels = ["CASHIER", "ONLINE"];

export const mainCron = async (_: Request, res: Response) => {
  try {
    const results: any[] = [];

    // create 5 random orders
    for (let i = 0; i < 5; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;

      if (!product) continue;

      const totalAmount = product.price * quantity;

      const newOrder = {
        fullName: "Auto Cron",
        email: "auto-cron@example.com",
        phoneNumber: "081234567890",
        tableNumber: `${Math.floor(Math.random() * 20) + 1}`,

        orderType: orderTypes[Math.floor(Math.random() * orderTypes.length)],
        paymentMethod:
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        orderChannel: channels[Math.floor(Math.random() * channels.length)],

        notes: "Generated hourly cron data",
        cashierId: "",
        totalAmount,

        items: [
          {
            productId: product.id,
            quantity,
          },
        ],
      };

      const response = await fetch(config.BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      const result = await response.json();
      results.push(result);
    }

    return res.json({
      message: "Cron Success (Created 5 orders)",
      orders: results,
    });
  } catch (err) {
    return res.status(500).json({ error: "Cron POST failed" });
  }
};
