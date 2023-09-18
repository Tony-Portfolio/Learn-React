import { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
import Item from '../components/Item';

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

function Index() {
    const [products, setProducts] = useState<Product[]>([]);

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

    return (
        <div className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-20">
            {products.map((product) => (
                <Item product={product} key={product.id}/>
            ))}
        </div>
    );
}

export default Index;
