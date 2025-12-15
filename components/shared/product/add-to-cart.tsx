'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart } from '@/lib/actions/cart.actions';

import { CartItem } from '@/types';

const AddToCart = ({ item }: { item: CartItem }) => {

    const router = useRouter();

    const handleAddToCart = async () => {
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
            }
    );
    }

    return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
        <Plus /> Add to Cart
    </Button>);
}

export default AddToCart;