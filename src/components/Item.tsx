import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

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

function Item({ product }: { product: Product }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const delay = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(delay);
    }, []);

    return (
        <Link to={`/product/${product.id}`}>
            <div className={`text-sm ${isLoading ? 'animate-pulse' : ''}`}>
                {isLoading ? (
                    <>
                        <div className="bg-gray-300 h-[200px] w-full object-cover rounded mb-2"></div>
                        <div className="bg-gray-300 h-5 w-2/3 rounded mb-1"></div>
                        <div className="bg-gray-300 h-5 w-1/2 rounded mb-1"></div>
                        <div className="bg-gray-300 h-5 w-1/3 rounded mb-2"></div>
                        <div className="bg-gray-300 h-5 w-1/4 rounded"></div>
                    </>
                ) : (
                    <>
                        <img className="h-[200px] w-full object-cover rounded mb-2" src={product.thumbnail} alt={product.title} loading="lazy" />
                        <h2 className="font-bold text-base">{product.title}</h2>
                        <p className="text-black/80 font-medium my-2">{product.description}</p>
                        <p>Brand: {product.brand}</p>
                        <p>Stok: {product.stock}</p>
                        <p className="mt-2">${product.price.toLocaleString()}.00</p>
                    </>
                )}
            </div>
        </Link>
    );
}

export default Item;
