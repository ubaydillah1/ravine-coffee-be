import type { ProductCategory } from "@prisma/client";
import prisma from "../lib/prisma.js";
import type { Request, Response } from "express";

// PRODUCTS
export const products = [
  {
    id: "f069a6ae-74cf-4255-9db2-be2be9edf7fb",
    name: "Red Velvet",
    price: 22000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762712899919-Varian%204.png",
    category: "COFFEE",
  },
  {
    id: "3b765e6c-cb4d-41b2-b4c6-a016dd019f39",
    name: "Hazelnut Coffee",
    price: 22000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762712860579-Varian%201.png",
    category: "COFFEE",
  },
  {
    id: "4580e8c4-b517-4140-8b83-6b084e45059f",
    name: "Americano",
    price: 18000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762712975845-Varian%202.png",
    category: "COFFEE",
  },
  {
    id: "45156fde-6eae-46c3-b1f3-c24ad253cfc7",
    name: "Strawberry Boba Milk",
    price: 26000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713026995-2.png",
    category: "MILK",
  },
  {
    id: "966329d9-dd59-49dd-9918-29f622395b4b",
    name: "Chocolate Boba Milk",
    price: 26000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713128834-5%20(2).png",
    category: "MILK",
  },
  {
    id: "ba2eb5ea-6f23-44ce-9741-7aa90bb71ef2",
    name: "Lemon Tea",
    price: 22000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713192721-8.png",
    category: "TEA",
  },
  {
    id: "75ab575e-7f31-4c1b-92d2-6ed9e1f77fc2",
    name: "Lychee Tea",
    price: 22000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713224700-2%2021.png",
    category: "TEA",
  },
  {
    id: "b8e126e5-745a-4642-9054-9ab553be8dfe",
    name: "French Fries",
    price: 18000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713244977-French%20fries.png",
    category: "SNACK",
  },
  {
    id: "75458f4a-d615-4cb6-974e-70376fa658d2",
    name: "Toast",
    price: 18000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713259800-Toast.png",
    category: "SNACK",
  },
  {
    id: "32bee00f-0595-4766-935f-af838a209f29",
    name: "Sausage",
    price: 18000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713271468-Sausage.png",
    category: "SNACK",
  },
  {
    id: "83c45b22-3244-492f-8923-757362750645",
    name: "Bundle 1",
    price: 42000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713304951-5%201.png",
    category: "BUNDLE",
  },
  {
    id: "c0ba8bb4-611d-492b-8914-6ba54fd39578",
    name: "Bundle 2",
    price: 38000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713320085-5%201.png",
    category: "BUNDLE",
  },
  {
    id: "c863cce5-043b-4ef3-bade-c52dc0140c1c",
    name: "Bundle 3",
    price: 28000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713333651-5%201.png",
    category: "BUNDLE",
  },
  {
    id: "2408b74d-0ddd-44e4-afd4-763f8ec52ded",
    name: "White Boba Milk",
    price: 26000,
    image:
      "https://xdngzcfffaqezcrelqya.supabase.co/storage/v1/object/public/product-images/1762713086290-3.png",
    category: "MILK",
  },
];

// USERS
export const customers = [
  {
    id: "d0ec0394-5972-41e6-a6e6-fa371bde22fa",
    fullName: "John",
  },
  {
    id: "aea165d1-e4bb-451b-9867-004f650b65f7",
    fullName: "test dulu",
  },
  {
    id: "18a9cff8-c5fa-4b16-8b5d-fc55b025abff",
    fullName: "test",
  },
  {
    id: "8a797048-7a88-4b14-b58c-ee227ece664a",
    fullName: "Djarot",
  },
  {
    id: "79cb9344-b1bc-449e-b1b4-5e9a12f6717d",
    fullName: "Djarot1",
  },
  {
    id: "699a7540-0e16-468d-a191-4a5fab2ccdb4",
    fullName: "Milk",
  },
  {
    id: "9ac223aa-47ca-44e6-b6fc-2e7e66eb1899",
    fullName: "test",
  },
  {
    id: "877e2e1f-1d6f-47d9-aee2-f5557d1c62b4",
    fullName: "Malina",
  },
  {
    id: "4dd3f5fb-a201-4ee7-8e8b-51610604d593",
    fullName: "test",
  },
  {
    id: "8427cafc-8a9a-46f9-a8e0-665dfc3e96ac",
    fullName: "john",
  },
  {
    id: "34d0f194-0d7f-49ba-962f-b08cb1bf5fad",
    fullName: "test",
  },
  {
    id: "309e0b26-4f05-49ba-83ea-de4dcd0734b8",
    fullName: "test21",
  },
  {
    id: "4a6ae312-0ef2-4d95-9535-1f87c820e8ea",
    fullName: "test",
  },
  {
    id: "913691f4-d11d-4874-ba0b-9267108a0ad0",
    fullName: "test",
  },
  {
    id: "194cb540-ea0c-427f-b2df-e7c5c164e97a",
    fullName: "john",
  },
  {
    id: "21e0b5d9-6df1-4c91-8bd2-3a1b7fb56986",
    fullName: "test",
  },
  {
    id: "3b7cdcf4-2e59-4690-ba99-d100d2ccdf9b",
    fullName: "john",
  },
  {
    id: "b96c4229-3fcd-47de-a2ba-d60e41170a34",
    fullName: "Ubay",
  },
  {
    id: "4ea444f7-c9e6-496c-8ae1-4cbada49a627",
    fullName: "test",
  },
  {
    id: "ab822942-68bb-484b-ba05-004749bfc5bf",
    fullName: "Test",
  },
  {
    id: "63fa6f97-a8df-45cd-b9ab-6d4dd34cd742",
    fullName: "test",
  },
  {
    id: "b8ce65f8-a7fd-4868-a85c-bbe3b9423f3b",
    fullName: "John Due",
  },
  {
    id: "8fd97141-4288-43c1-81b1-ee7b1eef52cf",
    fullName: "John Due",
  },
  {
    id: "e02699a2-d27c-438a-91d9-eb5a68f5ecd6",
    fullName: "john",
  },
  {
    id: "5d527113-ae53-4686-98ac-888080c1f8c3",
    fullName: "test",
  },
  {
    id: "e3cb56ef-8d4c-4f31-bd52-9dab796abb6f",
    fullName: "Ubay",
  },
  {
    id: "72457c29-df4f-4242-87b5-7452d45ca41c",
    fullName: "John",
  },
  {
    id: "c9116b47-a5ce-415e-abb4-a6b860ab0317",
    fullName: "Tony",
  },
];

// CASHIERS
export const cashiers = [
  {
    id: "e6f0de76-8de9-42b7-aa14-2789336ef63f",
  },
];

export const mainCron = async (_: Request, res: Response) => {
  try {
    const results: any[] = [];

    for (let i = 0; i < 5; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];

      if (!product || !customer) continue;

      const orderChannel = Math.random() > 0.5 ? "CASHIER" : "ONLINE";

      const cashier =
        orderChannel === "CASHIER"
          ? cashiers[Math.floor(Math.random() * cashiers.length)]
          : null;

      const quantity = Math.floor(Math.random() * 3) + 1;
      const subtotal = product.price * quantity;
      const tax = Math.round(subtotal * 0.1);
      const totalAmount = subtotal + tax;

      const order = await prisma.order.create({
        data: {
          customerId: customer.id,
          cashierId: cashier?.id || null,

          orderChannel,
          tableNumber: `${Math.floor(Math.random() * 20) + 1}`,
          notes: "Generated by cron",
          taxAmount: tax.toString(),
          totalAmount: totalAmount.toString(),
          subTotalAmount: subtotal.toString(),

          orderStatus: "COMPLETED",
          paymentStatus: "SUCCESS",

          paymentMethod: Math.random() > 0.5 ? "CASH" : "QRIS",
          orderType: Math.random() > 0.5 ? "TAKE_AWAY" : "DINE_IN",

          OrderItem: {
            create: [
              {
                quantity,
                subtotal: subtotal.toString(),

                productId: product.id,
                productName: product.name,
                productPrice: product.price.toString(),
                productImage: product.image,
                productCategory: product.category as ProductCategory,
              },
            ],
          },

          OrderHistory: {
            create: [
              {
                orderStatus: "COMPLETED",
              },
            ],
          },
        },
        include: {
          OrderItem: true,
        },
      });

      results.push(order);
    }

    res.json({ message: "Cron job completed", results });
  } catch (err) {
    res.status(500).json({ error: "Cron failed" });
  }
};
