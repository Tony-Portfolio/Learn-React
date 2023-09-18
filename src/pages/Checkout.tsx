import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Product {
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
interface Product2 {
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
    quantity: number;
}
interface CheckoutItem {
    id_product: number;
    quantity: number;
    id: number;
}

const Checkout = ({ supabase }: any) => {
    const [products, setProducts] = useState<Product[]>([]);
    let getCheckoutData: CheckoutItem[] = [];
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        cardNumber: '',
        shippingAddress: '',
        agreedToPolicy: false,
    });

    const handleChange = (event: any) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const checkoutDataString = localStorage.getItem("dataCheckout");

    if (checkoutDataString !== null) getCheckoutData = JSON.parse(checkoutDataString);

    useEffect(() => {
        fetch('https://dummyjson.com/products?limit=100')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const [cartItems, setCartItems] = useState<Product2[]>([]);

    useEffect(() => {
        const filteredProducts: Product2[] = [];

        for (const item of getCheckoutData) {
            const matchingProduct = products.find((product) => product.id === item.id_product);
            if (matchingProduct) {
                filteredProducts.push({
                    ...matchingProduct as Product,
                    quantity: item.quantity,
                });
            }
        }

        setCartItems(filteredProducts);
    }, [products]);


    const calculateTotalPrice = () => {
        let totalPrice = 0;

        cartItems.forEach((item: any) => {
            totalPrice += item.price * item.quantity;
        });

        return totalPrice;
    };
    const [isChecked, setIsChecked] = useState(false);
    const triggerPopUp = (event: any) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        if (!isChecked) {
            Swal.fire({
                icon: "info",
                text: "Your provided information will be recorded for record-keeping purposes and will not be used for any other purposes.",
                confirmButtonText: "Yes I Understand"
            });
        }
    }

    const handleFormSubmission = async (event: any) => {
        event.preventDefault();
        const itemId = getCheckoutData.map((item: any) => item.id);
        const { error } = await supabase
            .from('cart')
            .delete()
            .in('id', itemId)
        if (error) {
            console.log("ERROR : ", error);
        }
        const total = calculateTotalPrice() + 15;
        const { data: { user } } = await supabase.auth.getUser();

        const { data, errorInsert } = await supabase
            .from('checkout')
            .insert([
                {
                    fullname: formData.fullName,
                    email: formData.emailAddress,
                    phonenumber: formData.phoneNumber,
                    cardnumber: formData.cardNumber,
                    address: formData.shippingAddress,
                    data: cartItems,
                    total: total,
                    useremail: user.email
                },
            ])
            .select()

        if(data){
            Swal.fire({
                icon:"success",
                text:"success, your item will be delivered soon",
                showConfirmButton:false,
                timer:3000,
                willClose:() => {
                    navigate("/");
                }
            })
        }
        if(errorInsert) return;
        console.log(itemId, formData)
    }



    return (
        <>
            <div className="flex flex-col md:flex-row justify-between min-h-[80vh] w-full md:w-11/12 mx-auto">
                {/* Left side - Cart items */}
                <div className="w-full md:w-6/12 bg-white rounded-lg p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Your Items</h2>
                    {cartItems.length === 0 ? (
                        <p className="text-gray-600">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item: any) => (
                            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 border-b border-gray-200 pb-4 md:pb-6">
                                <div className="flex items-center space-x-2 md:space-x-4 w-full">
                                    <img src={item.thumbnail} alt={item.name} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg" />
                                    <div>
                                        <h3 className="text-md md:text-lg font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">{item.brand}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="md:text-right mt-4 md:mt-0 shrink-0">
                                    <p className="text-md md:text-lg">${(item.price * item.quantity).toLocaleString()}.00</p>
                                    {item.quantity > 1 && (
                                        <p className="text-gray-500 text-sm">${item.price.toLocaleString()}.00 Each</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {cartItems.length > 0 && (
                        <div className="mt-4 md:mt-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm md:text-base font-medium">Subtotal: </h3>
                                <h3>${calculateTotalPrice().toLocaleString()}.00</h3>
                            </div>
                            <hr className="my-4" />
                            <div className="text-gray-500">
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-600">Shipping (Standard): </p>
                                    <p>$15.00</p>
                                </div>
                                <p>Ground shipping (3-5) business day</p>
                            </div>
                            <hr className="my-4" />
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm md:text-base font-medium">Total: </h3>
                                <h3>${(calculateTotalPrice() + 15).toLocaleString()}.00</h3>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side - Checkout Form */}
                <div className="w-full md:w-6/12 mt-4 md:mt-0">
                    <div className="sticky top-20 right-0 bg-white rounded-lg p-4 md:p-6">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4">Payment Details</h2>
                        <form onSubmit={handleFormSubmission}>
                            <div className="mb-4">
                                <label className="block text-gray-600">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-[#9333ea] placeholder-gray-500"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">Email Address</label>
                                <input
                                    type="email"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-[#9333ea] placeholder-gray-500"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-[#9333ea] placeholder-gray-500"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-[#9333ea] placeholder-gray-500"
                                    placeholder="Enter your card number"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">Shipping Address</label>
                                <textarea
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-[#9333ea] placeholder-gray-500"
                                    placeholder="Enter your shipping address"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">
                                    <input
                                        type="checkbox"
                                        name="agreedToPolicy"
                                        checked={formData.agreedToPolicy}
                                        onChange={(event) => {
                                            handleChange(event);
                                            triggerPopUp(event);
                                        }}
                                        required
                                    />{" "}
                                    By checking this box, you agree to our policy
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#9333ea] text-white font-semibold py-2 md:py-3 rounded-lg hover:bg-[#7e22ce] transition duration-300 ease-in-out"
                            >
                                Pay ${(calculateTotalPrice() + 15).toLocaleString()}.00
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Checkout