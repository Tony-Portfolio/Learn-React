import { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import "./detail.css";

// Define an interface for the product data
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

function Detail({ supabase }: any) {
    const { pathname } = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const [product, setProduct] = useState<Product | any>([]);
    const [img, setImg] = useState([]);
    const [showImg, setShowImg] = useState(product.thumbnail);
    const { id } = useParams();

    useEffect(() => {
        fetch('https://dummyjson.com/product/' + id)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                setImg(data.images);
                setShowImg(data.thumbnail);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [id]);

    const changeImgShow = (url: string) => {
        setShowImg(url);
    }

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (event: any) => {
        const newQuantity = parseInt(event.target.value);
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const totalPrice = product.price * quantity;

    const addItem = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const submissionData = {
            email: user.email,
            id_product: parseInt(product.id),
            quantity: quantity
        };
        console.log(submissionData);

        if (user) {
            // Check if a row with the same email, id_product, and quantity already exists
            const { data: existingData, error } = await supabase
                .from('cart')
                .select('id, quantity')
                .eq('email', user.email)
                .eq('id_product', parseInt(product.id))
                .single();

            if (error && error.message != "JSON object requested, multiple (or no) rows returned") {
                console.error('Error checking for existing data:', error.message);
                return;
            }

            if (existingData) {
                // Row with the same email, id_product, and quantity exists, update the quantity
                const existingId = existingData.id;
                const existingQuantity = existingData.quantity;
                const newQuantity: number = parseInt(existingQuantity) + quantity;

                const { data, error: updateError } = await supabase
                    .from('cart')
                    .update({ quantity: newQuantity })
                    .eq('id', existingId)
                    .select();

                if (updateError) {
                    console.error('Error updating existing data:', updateError.message);
                    return;
                }
                else {
                    console.log(data);
                }
            } else {
                console.log("yay")
                // Row with the same email, id_product, and quantity doesn't exist, insert a new row
                const { error: insertError } = await supabase
                    .from('cart')
                    .insert([submissionData]);

                if (insertError) {
                    console.error('Error inserting new data:', insertError.message);
                    return;
                }
            }
            Swal.fire({
                icon: 'success',
                title: 'Product added!',
                text: 'Product have been added to your cart',
                footer: 'Check your cart <Link to="/cart">Here</Link>',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [product])

    const shareLink = () => {
        const tempInput = document.createElement("input");

        const url = window.location.href;

        tempInput.value = url;

        document.body.appendChild(tempInput);

        tempInput.select();

        document.execCommand("copy");

        document.body.removeChild(tempInput);

        Swal.fire({
            icon: 'info',
            title: 'Link Copied!',
            text: 'Share the link to your friends',
            timer: 2000,
            showConfirmButton: false,
        });
    }



    return (
        <div className="relative">
            {loading ? (
                <>
                    <div className="overlay"></div>
                    <div className="loading-container">
                        <div className="ball ball1"></div>
                        <div className="ball ball2"></div>
                        <div className="ball ball3"></div>
                    </div>
                </>
            ) : (
                <>
                    <div className="md:hidden cursor-pointer absolute top-4 left-4">
                        <div className="bg-gray-100 p-1 rounded-full" onClick={() => { history.back() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                    <main className="w-full max-w-[1200px] md:mx-auto mx-0">
                        <section className="md:my-0 md:mx-4 md:p-4 md:p-0">
                            <div className="md:flex items-center gap-4 hidden w-full justify-between py-4">
                                <div className="">
                                    <h3 className="font-bold text-3xl">{product.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-normal">
                                            <i className="fa-solid fa-star"></i> {product.rating}
                                        </span>
                                        <span className="text-[14px] font-normal">Ulasan</span>
                                        <span className="text-[14px] font-normal">Brand: {product.brand}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center text-[14px] font-[500] gap-2 cursor-pointer" onClick={shareLink}>
                                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                                        <p className="underline">Bagikan</p>
                                    </div>
                                    <div className="flex items-center text-[14px] font-[500] gap-2">
                                        <i className="fa-regular fa-heart"></i>
                                        <p className="underline">Simpan</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-5 md:gap-10 w-full grid-cols-1">
                                <div className="md:flex gap-2 md:flex-row flex-col">
                                    <img
                                        src={showImg}
                                        alt={product.title}
                                        className="h-[400px] sm:h-auto block m-auto w-full md:aspect-auto object-cover object-top"
                                        id="img-variant-show"
                                    />
                                    <div className="md:grid-cols-2 grid-row-3 gap-2 grid-cols-5 grid p-2 md:p-0">
                                        {img.map((imageUrl, index) => (
                                            <img
                                                key={index}
                                                src={imageUrl}
                                                alt={`Product Image ${index + 1}`}
                                                className="border-[1px] border-black/[0.2] w-full h-full object-cover rounded-lg aspect-video cursor-pointer"
                                                onClick={() => changeImgShow(imageUrl)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start md:justify-between md:gap-8 flex-col flex-grow p-4 md:p-0 mt-8">
                                <div className="md:p-0 p-0 text-sm lg:text-base font-medium w-full">
                                    <h3 className="font-bold text-3xl md:hidden">{product.title}</h3>
                                    <h3 className="font-semibold text-3xl md:block hidden">{product.title}</h3>

                                    <div className="bg-white rounded-lg md:p-4 mt-4">
                                        <p className="text-lg text-gray-700 mb-4">{product.description}</p>

                                        <div className="flex flex-col md:flex-row justify-between">
                                            <div className="md:w-1/2">
                                                <p className="my-2">
                                                    <span className="font-semibold">Item Condition:</span> New
                                                </p>
                                                <p className="my-2">
                                                    <span className="font-semibold">Brand:</span> {product.brand}
                                                </p>
                                                <p className="my-2">
                                                    <span className="font-semibold">Kategori:</span> {product.category}
                                                </p>
                                            </div>
                                            <div className="md:w-1/2">
                                                <p className="my-2">
                                                    <span className="font-semibold">Minimum Purchase:</span> 1
                                                </p>
                                                <p className="my-2">
                                                    <span className="font-semibold">Available in Stock:</span>{" "}
                                                    {product.stock}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-8 w-full block" />
                                <div className="p-0 rounded w-full shrink-0">
                                    <div className="rounded font-bold flex flex-col gap-4 md:gap-0">
                                        <div className="md:p-2 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-semibold">{product.title}</h3>
                                                <span className="text-base text-gray-500">
                                                    <i className="fa-solid fa-star text-[#FFD700]"></i> {product.rating}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg text-black/[0.8]">
                                                    ${product.price}.00 / pcs
                                                </p>
                                                <p className="text-lg text-black/[0.8]">
                                                    Stok: {product.stock} pcs
                                                </p>
                                            </div>
                                        </div>
                                        <hr className="my-4 md:block hidden" />
                                        <div className="flex flex-col gap-4">
                                            <label htmlFor="quantity" className="text-lg font-semibold text-black/[0.8]">
                                                Quantity
                                            </label>
                                            <div className="flex items-center w-full md:w-auto">
                                                <button
                                                    className="text-2xl text-[#FF385C] cursor-pointer w-12 h-12 flex items-center justify-center bg-slate-800/[0.015] rounded-full"
                                                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={product.stock}
                                                    className="text-center h-12 border-2 border-black/[0.1] rounded w-full"
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
                                                />
                                                <button
                                                    className="text-2xl text-[#FF385C] cursor-pointer w-12 h-12 flex items-center justify-center bg-slate-800/[0.015] rounded-full"
                                                    onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <hr className="my-4 md:block hidden" />
                                        <div className="flex items-center justify-between flex-row p-2">
                                            <p className="text-lg font-semibold text-black/[0.8]">
                                                ${product.price}.00 x {quantity}
                                            </p>
                                            <p className="text-lg font-semibold text-black/[0.8]">
                                                ${totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center flex-row my-2 p-2">
                                            <p className="text-xl font-semibold">Total: $<span id="total">{totalPrice.toFixed(2)}</span></p>
                                        </div>
                                        <div className="flex items-center justify-center gap-4 flex-wrap">
                                            <button onClick={addItem} className="text-base p-3 text-white bg-[#FF385C] border-2 border-[#FF385C] w-36 hover:bg-[#FF385C] hover:text-white transition duration-300 ease-in-out rounded">
                                                <i className="fa-solid fa-cart-shopping mx-2"></i> Add to Cart
                                            </button>
                                            <button className="text-base p-3 text-white bg-[#FF385C] border-2 border-[#FF385C] w-36 hover:bg-[#FF385C] hover:text-white transition duration-300 ease-in-out rounded">
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="mx-0 sm:mx-4 mt-8">
                            <div className="md:p-0 p-4">
                                <hr className="my-4" />
                                <div className="">
                                    <div className="flex items-center gap-2">

                                        <span className="text-[14px] font-[500] text-xl flex items-center gap-1"><svg
                                            xmlns="http://www.w3.org/2000/svg" fill="#FF385C" viewBox="0 0 24 24" stroke-width="1.5"
                                            className="w-8 h-8">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                            {product.rating}</span>
                                        <i className="fa-solid fa-circle text-[3px]"></i>
                                        <h2 className="my-4 font-bold text-xl flex items-center gap-2">Ulasan</h2>
                                    </div>
                                    <div className="my-4 flex flex-col gap-8">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <div className="">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                                        className="w-[40px] bg-gray-500/[0.2] p-1 rounded-full" />
                                                </div>
                                                <div className="">
                                                    <h3 className="font-bold text-[15px]">jessica_23</h3>
                                                    <p className="font-[500] text-[13px]">Mei 2022</p>
                                                </div>
                                            </div>
                                            <div className="">
                                                <p>Pengiriman nya cepat</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <div className="">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                                        className="w-[40px] bg-gray-500/[0.2] p-1 rounded-full" />
                                                </div>
                                                <div className="">
                                                    <h3 className="font-bold text-[15px]">Friska8</h3>
                                                    <p className="font-[500] text-[13px]">June 2022</p>
                                                </div>
                                            </div>
                                            <div className="">
                                                <p>Produknya berkualitas dan sesuai dengan yang difoto</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <div className="">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                                        className="w-[40px] bg-gray-500/[0.2] p-1 rounded-full" />
                                                </div>
                                                <div className="">
                                                    <h3 className="font-bold text-[15px]">Agus77</h3>
                                                    <p className="font-[500] text-[13px]">Feb 2022</p>
                                                </div>
                                            </div>
                                            <div className="">
                                                <p>Murah dan pengiriman cepat!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section >
                    </main >
                    {/* {
                product && (
                    <div key={product.id} className="text-sm">
                        <img className="h-[200px] w-full object-cover" src={product.thumbnail} alt={product.title} loading="lazy" />
                        <h2 className="font-bold text-base">{product.title}</h2>
                        <p className="text-black/80 font-medium my-2">{product.description}</p>
                        <p>Brand : {product.brand}</p>
                        <p>Stok : {product.stock}</p>
                        <p className="mt-2">${product.price}.00</p>
                    </div>
                )
            } */}
                </>
            )}
        </div >
    );
}

export default Detail;
