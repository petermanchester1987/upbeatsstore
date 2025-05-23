import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../lib/generated/prisma';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { itemsPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { shippingPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { taxPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { totalPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { itemsPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { shippingPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { taxPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        needs: { totalPrice: true },
        compute(cart) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
          return cart.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-ignore
        compute(cart) {
          return cart.price.toString();
        },
      },
    },
  },
});