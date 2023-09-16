import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

type ProductItem = {
    id_product: number;
    quantity: number;
};

interface ListProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}


const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-gray-300 h-8 w-2/3 rounded mb-4"></div>
        <div className="bg-gray-300 h-6 w-1/2 rounded mb-2"></div>
        <div className="bg-gray-300 h-6 w-3/4 rounded mb-4"></div>
        <div className="bg-gray-300 h-6 w-2/5 rounded mb-2"></div>
        <div className="bg-gray-300 h-6 w-4/5 rounded mb-4"></div>
        <div className="bg-gray-300 h-8 w-3/4 rounded mb-4"></div>
        <div className="bg-gray-300 h-6 w-2/5 rounded"></div>
    </div>
);

const Cart = ({ supabase }: any) => {
    const [product, setProduct] = useState<ProductItem[]>([]);
    const [listProduct, setListProduct] = useState<ListProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            const { data: existingData, error } = await supabase
                .from('cart')
                .select('id, id_product, quantity')
                .eq('email', user.email)

            if (error && error.message != "JSON object requested, multiple (or no) rows returned") {
                console.error('Error checking for existing data:', error.message);
                return;
            }
            setProduct(existingData);

            fetch('https://dummyjson.com/products?limit=100')
                .then((response) => response.json())
                .then((data) => {
                    setListProduct(data.products);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (product.length > 0 && listProduct.length > 0) {
            let totalPrice = 0;

            for (const item of product) {
                const currentProduct = listProduct.find((p: any) => p.id === item.id_product);

                if (currentProduct) {
                    const itemTotal = currentProduct.price * item.quantity;
                    totalPrice += itemTotal;
                }
            }
            setTotal(totalPrice);
            setIsLoading(false);
        }
    }, [product, listProduct]);

    const removeItem = (id: number) => {
        Swal.fire({
            icon: "question",
            title: "Delete Item",
            text: "remove this item from your cart ?",
            showConfirmButton: true,
            confirmButtonText: "Delete",
            showCancelButton: true,
            confirmButtonColor: "#ef4444"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const deleteItem = async () => {
                        const { error } = await supabase
                            .from('cart')
                            .delete()
                            .eq('id', id)
                        if (error) {
                            return;
                        } else {
                            const updatedItems = product.filter((item: any) => item.id !== id);
                            setProduct(updatedItems);
                        }
                    }
                    deleteItem();
                }
                catch (error: any) {
                    console.log("ERROR : ", error)
                }
            }
        })
    }

    useEffect(() => {
        const calculateTotal = () => {
            let totalPrice = 0;

            for (const item of product) {
                const currentProduct = listProduct.find((p: any) => p.id === item.id_product);

                if (currentProduct) {
                    const itemTotal = currentProduct.price * item.quantity;
                    totalPrice += itemTotal;
                }
            }
            setTotal(totalPrice);
        }
        calculateTotal();
    }, [product] || [listProduct])

    return (
        <div className="w-full max-w-[1200px] mx-auto my-4 min-h-screen overflow-hidden">
            <div className="md:mx-auto md:my-4 flex flex-col w-full px-4 md:px-14 min-h-screen">
                <div className="w-full flex items-center justify-center text-center md:relative sticky top-0 left-0 w-full bg-white p-4 md:bg-transparent md:p-0">
                    <h4 className="font-[500] text-lg md:text-2xl flex justify-center md:justify-start items-center gap-2 relative md:text-left text-center w-full block">
                        Cart
                        <Link to="/">
                            <span className="absolute top-[50%] translate-y-[-50%] left-[10px] md:left-[-40px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </span>
                        </Link>
                    </h4>
                </div>
                <div className="flex gap-4 md:gap-20 items-start justify-start md:flex-row flex-col-reverse my-4">
                    <div className="md:p-6 md:border-[1px] md:border-black/[0.1] rounded-lg flex flex-col gap-6 w-full mx-auto md:sticky top-[20px]">
                        <div className="flex flex-col gap-8">
                            <h4 className="font-[600] text-xl text-black/[0.8] text-left">Order Details & Price Breakdown</h4>
                            {isLoading ? (
                                <LoadingSkeleton />
                            ) : (
                                product.map((item: any) => {
                                    const itemList: any = listProduct.find((result: any) => result.id === item.id_product);

                                    if (!itemList) {
                                        return null;
                                    }

                                    return (
                                        <div key={item.id_product} className="flex items-start justify-between relative">
                                            <div className="flex gap-2">
                                                <div className="mx-4">
                                                    <input type="checkbox" className="scale-[1.4]" />
                                                </div>
                                                <div className="">
                                                    <img src={itemList.thumbnail} alt={itemList.title} className="w-[100px] h-[90px] object-cover object-top" />
                                                </div>
                                                <div className="flex flex-col justify-between">
                                                    <h4 className="font-bold text-[16px]">{itemList.title}</h4>
                                                    <p className="font-[500] text-[15px]">${itemList.price}.00 x {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-[500] text-[15px] whitespace-nowrap">${parseInt(itemList.price) * parseInt(item.quantity)}.00</p>
                                            <p className="absolute bottom-0 right-[0px] font-[500] text-[16px] underline text-red-500 cursor-pointer" onClick={() => {
                                                removeItem(item.id)
                                            }}>
                                                Remove
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <hr />
                        <div>
                            <div className="font-[13px] font-[600] flex items-center justify-between text-black/[0.8]">
                                <h4>Total (<span className="underline">USD</span>)</h4>
                                <p>${total}.00</p>
                            </div>
                        </div>
                        <button className="bg-gradient-to-r from-[#E92153] to-[#DE105E] w-full p-3 px-6 rounded-md text-white text-center text-[15px] font-bold">
                            Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
