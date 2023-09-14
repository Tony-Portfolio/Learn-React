import { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";

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

function Detail() {
    const { pathname } = useLocation();

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

    return (
        <div className="">
            <div className="absolute top-4 left-4">
                <div className="bg-white p-1 rounded-full" onClick={() => {history.back()}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </div>
            </div>
            <main className="w-full max-w-[1200px] md:mx-auto mx-0">
                <section className="md:my-0 md:mx-4 md:p-4 md:p-0">
                    <div className="flex items-center gap-4 md:flex hidden w-full justify-between py-4">
                        <div className="flex items-start flex-col">
                            <h3 className="font-bold text-3xl flex flex-col">
                                {product.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="">
                                    <span className="text-[14px] font-[400] underline flex items-center gap-1"><svg
                                        xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                        {product.rating}</span>
                                </div>
                                <i className="fa-solid fa-circle text-[3px]"></i>
                                <div className="flex items-center text-[14px] font-[500] gap-2">
                                    <p className="underline">Ulasan</p>
                                </div>
                                <i className="fa-solid fa-circle text-[3px]"></i>
                                <div className="flex items-center text-[14px] font-[500] gap-2">
                                    <p className="underline">{product.brand}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center text-[14px] font-[500] gap-2 cursor-pointer">
                                <i className="fa-solid fa-arrow-up-from-bracket"></i>
                                <p className="underline">Bagikan</p>
                            </div>
                            <div className="flex items-center text-[14px] font-[500] gap-2">
                                <i className="fa-regular fa-heart"></i>
                                <p className="underline">Simpan</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden block">
                    </div >
                    <div className="grid gap-5 md:gap-10 w-full grid-cols-1">
                        <div className="">
                            <div className="md:flex gap-2 md:flex-row flex-col">
                                <img src={showImg} alt=""
                                    className="h-[400px] sm:h-auto; block m-auto w-full md:aspect-auto object-cover object-top"
                                    id="img-variant-show" />
                                <div className="md:grid-cols-2 grid-row-3 gap-2 grid-cols-5 grid p-2 md:p-0">
                                    {/* <img src={product.thumbnail} alt=""
                                        className="border-[1px] border-black/[0.2] w-full h-full object-cover rounded-lg aspect-video cursor-pointer" onClick={() => changeImgShow(product.thumbnail)} /> */}
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
                    </div >
                    <div className="flex items-start md:justify-between md:gap-8 flex-col md:flex-row flex-grow p-4 md:p-0 mt-8">
                        <div className="md:p-0 p-0 text-sm lg:text-base font-medium">
                            <h3 className="font-bold text-3xl flex flex-col md:hidden">
                                {product.title}
                                <span className="text-[14px] font-[400] underline flex items-center gap-1"><svg
                                    xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                                    {product.rating}</span>
                            </h3>
                            <h3 className="font-[600] text-3xl md:block hidden">{product.title}</h3>
                            <p className="my-2 my-4 text-lg font-[500]">
                                {product.description}
                            </p>
                            <p className="flex gap-2 my-2">
                                Kondisi : Baru
                            </p>
                            <p className="flex gap-2 my-2">
                                Brand :
                                {product.brand}
                            </p>
                            <p className="flex gap-2 my-2">
                                Kategori : {product.category}
                            </p>
                            <p className="flex gap-2 my-2">
                                Minimal pembelian : 1
                            </p>
                            <p className="mt-2">Stok Tersedia :
                                {product.stock}
                            </p>
                        </div>
                        {/* <hr className="my-8 w-full md:hidden block" />
                        <div
                            className="md:shadow-lg md:p-4 p-0 md:border-[1px] md:border-black/[0.1] rounded w-full md:w-[400px] shrink-0">
                            <div className="rounded font-bold flex flex-col gap-4 md:gap-0">
                                <div className="md:p-2 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[18px]">{product.title}</h3>
                                        <span className="text-[14px] font-[400] underline flex items-center gap-1"><svg
                                            xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                            {product.rating}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-[500] text-black/[0.8] text-[16px]">${product.price}.00 / pcs
                                        </p>
                                        <p className="font-[500] text-black/[0.8] text-[16px]">Stok : {product.stock}
                                            pcs</p>
                                    </div>
                                </div>
                                <hr className="my-4 md:block hidden" />
                                <div className="flex flex-col gap-2">
                                    <label for="quantity" className="text-[14px] font-[500] text-black/[0.8]">Quantity</label>
                                    <div className="flex items-center w-full md:w-auto">
                                        <p className="text-xl font-bold text-[#FF385C] cursor-pointer w-[40px] text-center bg-slate-800/[0.015] p-2 rounded">-</p>
                                        <input type="number" min="1"
                                            className="text-center w-full border-2 border-black/[0.1] rounded p-2" />
                                        <p className="text-xl font-bold text-[#FF385C] cursor-pointer w-[40px] text-center bg-slate-800/[0.015] p-2 rounded">+</p>
                                    </div>
                                </div>
                                <hr className="my-4 md:block hidden" />
                                <div className="flex items-center justify-between flex-row p-2">
                                    {/* <p className="font-[500] text-black/[0.8] text-[16px]">${product.price}.00 x {
                                                        quantity}
                                                    </p>
                                                    <p className="font-[500] text-black/[0.8] text-[16px]">${totalPrice.toLocaleString()}.00
                                                    </p>}
                                </div>
                                <div className="flex items-center flex-row my-2 p-2">
                                    <p className="text-xl">Total : $
                                        <span id="total">
                                            {totalPrice.toLocaleString()}.00
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-2 flex-nowrap flex-col">
                                    <button
                                        className="sm:text-base text-sm sm:p-3 p-0 text-[#FF385C] py-[13.5px] border-2 border-[#FF385C] w-full p-2 hover:bg-[#FF385C] hover:text-white transition duration-300 ease-in-out"><i className="fa-solid fa-cart-shopping mx-2"></i> Tambah ke
                                        keranjang</button>
                                    <button
                                        className="sm:text-base text-sm sm:p-3 p-0 text-white bg-[#FF385C] py-[13.5px] border-2 border-[#FF385C] w-full p-2 hover:bg-[#FF385C] hover:text-white transition duration-300 ease-in-out">Beli Sekarang</button>
                                </div >
                            </div >
                        </div > */}
                    </div >
                </section>
                <section className="mx-0 sm:mx-4">
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
        </div >
    );
}

export default Detail;
