'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { products as initialProducts } from '@/lib/data';

// Type for a single item in the cart
export type CartItem = {
  product: Product;
  quantity: number;
};

// Type for a simulated user
type User = {
  uid: string;
  email: string;
  storeName?: string; 
};

type Banner = {
    title: string;
    imageUrl: string;
}

// The shape of our context
interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  isSeller: boolean;
  cart: CartItem[];
  products: Product[];
  isUserLoading: boolean;
  banner: Banner;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, newQuantity: number) => void;
  signIn: (email: string, isSellerSignin?: boolean, storeName?: string) => void;
  adminSignIn: (email: string, pass: string) => Promise<boolean>;
  sellerSignIn: (email: string, pass: string) => Promise<boolean>;
  checkAdminAuth: () => void;
  checkSellerAuth: () => void;
  signOut: () => void;
  setBanner: (title: string, imageUrl: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews' | 'sold' | 'published'>) => void;
  removeProduct: (productId: string) => void;
  toggleProductPublication: (productId: string) => void;
}

// Create the context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// The provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [banner, setBannerState] = useState<Banner>({
      title: "Seasonal hot picks",
      imageUrl: "https://images.unsplash.com/photo-1667409702771-14213044ccc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxibGFjayUyMGZyaWRheXxlbnwwfHx8fDE3NjM5OTYzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  })
  const { toast } = useToast();
  const router = useRouter();


  const signIn = (email: string, isSellerSignin = false, storeName?: string) => {
    const userAccount: User = { uid: `local-user-${email}`, email };
    
    if (isSellerSignin) {
      setIsSeller(true);
      setIsAdmin(false);
      userAccount.storeName = storeName || `${email}'s Store`;
      sessionStorage.setItem('authRole', 'seller');
    } else {
      setIsSeller(false);
      setIsAdmin(false);
      sessionStorage.setItem('authRole', 'user');
    }
    
    setUser(userAccount);
    sessionStorage.setItem('user', JSON.stringify(userAccount));
    
    if (isSellerSignin) {
        router.replace('/seller');
    } else {
        router.push('/');
    }
  };
  
  const adminSignIn = async (email: string, pass: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email === 'admin@example.com' && pass === 'password') {
          const adminUser = { uid: 'local-admin', email };
          setUser(adminUser);
          setIsAdmin(true);
          setIsSeller(false);
          sessionStorage.setItem('authRole', 'admin');
          sessionStorage.setItem('user', JSON.stringify(adminUser));
          router.replace('/admin');
          return true;
      }
      return false;
  };

  const sellerSignIn = async (email: string, pass: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockVendors: Record<string, {password: string, storeName: string}> = {
      'seller@techwonders.com': { password: 'password', storeName: 'Tech Wonders' },
      'seller@soundscape.com': { password: 'password', storeName: 'SoundScape' },
    };
    
    // In a real app, you'd verify password. Here, we just check if email is a known vendor.
    if (mockVendors[email]) {
        signIn(email, true, mockVendors[email].storeName);
        return true;
    }
    // If not a known vendor, we can still sign them in as a new seller
    signIn(email, true);
    return true;
  };
  
  const checkAdminAuth = useCallback(() => {
    const authRole = sessionStorage.getItem('authRole');
    if (authRole === 'admin') {
        const userInStorage = sessionStorage.getItem('user');
        if (userInStorage) {
            setUser(JSON.parse(userInStorage));
            setIsAdmin(true);
        }
    }
  }, []);

  const checkSellerAuth = useCallback(() => {
    const authRole = sessionStorage.getItem('authRole');
    if (authRole === 'seller') {
        const userInStorage = sessionStorage.getItem('user');
        if (userInStorage) {
            setUser(JSON.parse(userInStorage));
            setIsSeller(true);
        }
    }
  }, []);


  const signOut = () => {
    setUser(null);
    setIsAdmin(false);
    setIsSeller(false);
    setCart([]);
    sessionStorage.removeItem('authRole');
    sessionStorage.removeItem('user');
    router.push('/');
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
        variant: 'destructive',
      });
      router.push('/signin');
      return;
    }
    if (!product.published) {
      toast({
        title: 'Product Not Available',
        description: 'This product is currently not available for purchase.',
        variant: 'destructive',
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
     toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  const setBanner = useCallback((title: string, imageUrl: string) => {
    setBannerState({ title, imageUrl });
  }, []);
  
  const addProduct = useCallback((newProductData: Omit<Product, 'id' | 'rating' | 'reviews' | 'sold' | 'published'>) => {
    setProducts(prev => {
      const newProduct: Product = {
        ...newProductData,
        id: String(prev.length + 1 + Math.random()), // more unique id
        rating: 0,
        reviews: 0,
        sold: 0,
        published: false, // Products are unpublished by default
      };
      return [...prev, newProduct];
    });
    toast({
      title: "Product Added",
      description: `${newProductData.name} has been added as a draft.`
    })
  }, [toast]);

  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
        title: 'Product Removed',
        description: 'The product has been successfully removed.',
        variant: 'destructive'
    })
  }, [toast]);

  const toggleProductPublication = useCallback((productId: string) => {
      setProducts(prev => prev.map(p => {
          if (p.id === productId) {
              const wasPublished = p.published;
              toast({
                title: wasPublished ? 'Product Unpublished' : 'Product Published',
                description: `${p.name} is now ${wasPublished ? 'hidden from' : 'visible on'} the main site.`
              });
              return { ...p, published: !p.published };
          }
          return p;
      }));
  }, [toast]);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      isSeller,
      cart,
      products,
      isUserLoading,
      banner,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      signIn,
      adminSignIn,
      sellerSignIn,
      checkAdminAuth,
      checkSellerAuth,
      signOut,
      setBanner,
      addProduct,
      removeProduct,
      toggleProductPublication,
    }),
    [user, isAdmin, isSeller, cart, products, isUserLoading, banner, checkAdminAuth, checkSellerAuth, addProduct, setBanner, signIn, removeProduct, toggleProductPublication]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the AppContext
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
