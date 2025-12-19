'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

import { Cart, CartItem } from '@/types';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleAddToCart = async () => {
        startTransition(async () => {
             const res = await addItemToCart(item);
                if (!res!.success) {
                    toast.error(res!.message);
                    return;
                }
                //Handle success
                toast.success(res!.message, {
                    action: (
                        <Button className= 'bg-primary text-white hover:bg-gray-800' onClick={() => router.push('/cart')}>
                            Go To Cart
                        </Button>
                    ),
                    
                });
        });
       
    }

    //Handle remove from cart
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId);
                if (!res!.success) {
                            toast.error(res!.message);
                            return;
                }
            //Handle success
            toast.success(res!.message)
            return;
        });
    }

    //Check if item is already in cart
    const existingItem = cart && cart?.items.find((x) => x.productId === item.productId);

    return existingItem ? (
        <div>
            <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
                {isPending ? (<Loader className='h-4 w-4 animate-spin' />) : (<Minus className='h-4 w-4'/>)}
            </Button>
            <span className="px-2">{existingItem?.qty}</span>
            <Button type='button' variant='outline' onClick={handleAddToCart}>
                {isPending ? (<Loader className='h-4 w-4 animate-spin' />) : (<Plus className='h-4 w-4'/>)}
            </Button>
        </div>

    ) : (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
            {isPending ? (
                <Loader className='h-4 w-4 animate-spin' />
            ) : (
                <Plus className='h-4 w-4'/>
            )}
        </Button>
        
    
    );
   
}

export default AddToCart;