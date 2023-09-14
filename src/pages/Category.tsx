import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

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

function Category() {
    const [products, setProducts] = useState<Product | any>([]);
    const { id } = useParams();

    useEffect(() => {
        fetch('https://dummyjson.com/products/category/' + id)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [id]);

    return (
        <div className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-20">
            {products.map((product: any) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                    <div className="text-sm">
                        <img className="h-[200px] w-full object-cover rounded mb-2" src={product.thumbnail} alt={product.title} loading="lazy" />
                        <h2 className="font-bold text-base">{product.title}</h2>
                        <p className="text-black/80 font-medium my-2">{product.description}</p>
                        <p>Brand : {product.brand}</p>
                        <p>Stok : {product.stock}</p>
                        <p className="mt-2">${product.price}.00</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Category;
