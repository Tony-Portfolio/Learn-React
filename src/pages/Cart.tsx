import { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
interface Checked {
    [key: number]: boolean;
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
    const navigate = useNavigate();

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
        else {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [product, listProduct]);

    const removeItem = (id: number) => {
        Swal.fire({
            icon: "question",
            title: "Remove Item",
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

    const [checkedItems, setCheckedItems] = useState<Checked[] | []>([]);

    const handleCheckboxChange = (itemId: any) => {
        setCheckedItems((prevCheckedItems: any) => ({
            ...prevCheckedItems,
            [itemId]: !prevCheckedItems[itemId],
        }));
    };

    const getCheckedItemsData = () => {
        const checkedItemIds = Object.keys(checkedItems).filter(
            (itemId: any) => checkedItems[itemId]
        );
        const checkedItemsData = product.filter((item) =>
            checkedItemIds.includes(item.id_product.toString())
        );

        console.log(checkedItemsData);
        localStorage.setItem("dataCheckout", JSON.stringify(checkedItemsData));
        navigate("/checkout");
    };


    return (
        <div className="w-full max-w-[1200px] mx-auto my-4 min-h-screen overflow-hidden">
            <div className="md:mx-auto md:my-4 flex flex-col w-full px-4 md:px-14 min-h-screen">
                <div className="w-full flex items-center justify-center text-center md:relative sticky top-0 left-0 w-full bg-white p-4 md:bg-transparent md:p-0">
                    <h4 className="font-[500] text-lg md:text-2xl flex justify-center md:justify-start items-center gap-2 relative md:text-left text-center w-full block">
                        Cart
                        <p onClick={() => { history.back() }} className="cursor-pointer">
                            <span className="absolute top-[50%] translate-y-[-50%] left-[10px] md:left-[-40px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </span>
                        </p>
                    </h4>
                </div>
                <div className="flex gap-4 md:gap-20 items-start justify-start md:flex-row flex-col-reverse my-4">
                    <div className="md:p-6 md:border-[1px] md:border-black/[0.1] rounded-lg flex flex-col gap-6 w-full mx-auto md:sticky top-[20px]">
                        <div className="flex flex-col gap-8">
                            <h4 className="font-[600] text-xl text-black/[0.8] text-left">Order Details & Price Breakdown</h4>

                            {/* Display loading skeleton while data is being fetched */}
                            {isLoading && (
                                <LoadingSkeleton />
                            )}

                            {/* Check if there are products in the cart */}
                            {product.length > 0 ? (
                                // Display order details when products exist
                                <>
                                    {product.map((item: any) => {
                                        const itemList: any = listProduct.find((result: any) => result.id === item.id_product);

                                        if (!itemList) {
                                            return null;
                                        }

                                        return (
                                            <div key={item.id_product} className="flex items-start justify-between relative">
                                                <div className="flex gap-2">
                                                    <div className="mx-4">
                                                        <input
                                                            type="checkbox"
                                                            className="scale-[1.4]"
                                                            checked={!!checkedItems[item.id_product]}
                                                            onChange={() => handleCheckboxChange(item.id_product)}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <img src={itemList.thumbnail} alt={itemList.title} className="w-[100px] h-[90px] object-cover object-top" />
                                                    </div>
                                                    <div className="flex flex-col justify-between">
                                                        <h4 className="font-bold text-[16px]">{itemList.title}</h4>
                                                        <p className="font-[500] text-[15px]">${itemList.price}.00 x {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-[500] text-[15px] whitespace-nowrap">${(parseInt(itemList.price) * parseInt(item.quantity)).toLocaleString()}.00</p>
                                                <p className="absolute bottom-0 right-[0px] font-[500] text-[16px] underline text-red-500 cursor-pointer" onClick={() => {
                                                    removeItem(item.id)
                                                }}>
                                                    Remove
                                                </p>
                                            </div>
                                        );
                                    })}
                                    <hr />
                                    <div className="font-[13px] font-[600] flex items-center justify-between text-black/[0.8]">
                                        <h4>Total (<span className="underline">USD</span>)</h4>
                                        <p>${total.toLocaleString()}.00</p>
                                    </div>
                                    <button className="bg-gradient-to-r from-[#9333ea] to-[#7e22ce] w-full p-3 px-6 rounded-md text-white text-center text-[15px] font-bold" onClick={getCheckedItemsData}>
                                        Cart
                                    </button>
                                </>
                            ) : (
                                <>
                                    {!isLoading && product.length === 0 && (
                                        (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 1a.8.8.0 00-.8.8v3.4l-.6.6H4a1 1 0 00-.9 1.45l5.7 11.3a1 1 0 001.8 0l5.7-11.3A1 1 0 0016 6H11.4l-.6-.6V1.8a.8.8 0 00-.8-.8zM10 3a.2.2 0 01.2.2v8.6l-.2.2H6a.5.5 0 00-.45.67L10 18l4.45-5.13a.5.5 0 00-.45-.67H10l-.2-.2V3.2a.2.2 0 01.2-.2zM7 8a1 1 0 112 0 1 1 0 01-2 0zm5 0a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-gray-600 text-lg mt-4">No items yet</p>
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
