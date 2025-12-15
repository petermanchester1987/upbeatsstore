'use server';

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from '@prisma/client';


// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    //Shipping price if it's over 100 is free otherwise 10
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
    return { 
        itemsPrice: itemsPrice.toFixed(2), 
        shippingPrice: shippingPrice.toFixed(2), 
        taxPrice: taxPrice.toFixed(2), 
        totalPrice: totalPrice.toFixed(2) }
};


export async function addItemToCart( data: CartItem ) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) throw new Error('Cart Session not found');
        //Get session and user id
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        const cart = await getMyCart();

        //Parse and validate item data
        const item = cartItemSchema.parse(data);

        //Find product in database
        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        });
        if (!product) throw new Error('Product not found');

        if (!cart) {
            //Create new cart
           const newCart = insertCartSchema.parse({
            userId: userId,
            items: [item],
            sessionCartId: sessionCartId,
            ...calcPrice([item])
           });
           await prisma.cart.create({
            data: newCart
           });

           //Revalidate the product page cache
           revalidatePath(`/product/${product.slug}`);

            return {
                success: true, 
                message: `${product.name} added to cart`,
            };
        } else {
            //Check if item is already in cart
            const existingItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);
            
            //Checking item is in stock
            if (existingItem) {
                //Check stock
                if (product.stock < existingItem.qty + 1) {
                    throw new Error(`Only ${product.stock} items in stock`);
                } 
                //Update item quantity
                (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existingItem.qty + 1;
            
            } else {
                //if it doesnt exist in cart
                // Check stock
                if (product.stock < 1) throw new Error(`Sorry! There are not enough items in stock`);

                //Add item to the cart.items
                cart.items.push(item);

                // save to database
                await prisma.cart.update({
                    where: { id: cart.id },
                    data: {
                        items: cart.items as Prisma.CartUpdateitemsInput[],
                        ...calcPrice(cart.items as CartItem[])
                    }
                });

                //Revalidate the product page cache
                revalidatePath(`/product/${product.slug}`);

                return {
                    success: true, 
                    message: `${product.name} ${existingItem ? 'updated in' : 'added to'} the cart`,
                };
            }
        }
    } catch (error) {
        return {
            success: false, 
            message: formatError(error),
        };
    }
}


export async function getMyCart() {
     // Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) throw new Error('Cart Session not found');
        //Get session and user id
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        //Get user cart from db
        const cart = await prisma.cart.findFirst({
            where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
        })
        if (!cart) return undefined;

        //Convert decimals and return
        return convertToPlainObject({
            ...cart,
            items: cart.items as CartItem[],
            itemsPrice: cart.itemsPrice.toString(),
            totalPrice: cart.totalPrice.toString(),
            shippingPrice: cart.shippingPrice.toString(),
            taxPrice: cart.taxPrice.toString()
        });
}

export async function removeItemFromCart( productId: string ) {
  try {

  } catch (error) {
    return {
        success: false, 
        message: formatError(error),
    };
  }