'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAppContext } from '@/context/AppContext';

export default function CartPage() {
  const { user, cart, removeFromCart, updateCartQuantity, isUserLoading } = useAppContext();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (isUserLoading) {
    return <div className="container py-8 text-center">Loading your cart...</div>;
  }

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Please <Link href="/signin" className="text-primary underline">sign in</Link> to view your cart.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return <div className="container py-8 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">My Cart ({cart.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {cart.map(({ product, quantity }) => {
                  return (
                    <div key={product.id} className="flex gap-4 p-4 items-center">
                      <div className="w-24 h-24 relative flex-shrink-0">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <Link href={`/product/${product.id}`} className="hover:underline">
                          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.store.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground" onClick={() => removeFromCart(product.id)}>
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                             <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground">
                                <Heart className="w-4 h-4"/>
                            </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-bold text-lg">{formatPrice(product.price)}</p>
                        <div className="flex items-center border rounded-md">
                           <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => updateCartQuantity(product.id, quantity - 1)} disabled={quantity <= 1}>-</Button>
                           <Input type="text" value={quantity} readOnly className="w-12 h-8 text-center border-0 focus-visible:ring-0"/>
                           <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => updateCartQuantity(product.id, quantity + 1)}>+</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
               <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Button size="lg" className="w-full">
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
