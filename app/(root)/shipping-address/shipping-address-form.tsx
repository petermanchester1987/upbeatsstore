'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from '@/lib/validators';
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, useForm } from "react-hook-form"
import * as z from "zod"
import { shippingAddressDefaultValues } from '@/lib/constants';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const ShippingAddressForm = ({address} : {address: ShippingAddress}) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

   
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues
  });

  const onSubmit = () => {
    return;
    }


    return ( <>
    <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">Please enter your shipping address details.</p>
        <Form {...form}>
            <form className='space-y-4' method='post' onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row gap-5">
                    <FormField control={form.control} name="fullName" render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'>}) => (
                        <FormItem className='w-full'>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Full Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                    <FormField control={form.control} name="streetAddress" render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'streetAddress'>}) => (
                        <FormItem className='w-full'>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Street Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                    <FormField control={form.control} name="city" render={({ field }: {field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'>}) => (
                        <FormItem className='w-full'>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter City" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </form>
        </Form>
    </div>
    </> );
}
 
export default ShippingAddressForm;