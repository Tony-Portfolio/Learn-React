import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import Item from '../components/Item';

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
                <Item product={product} key={product.id}/>
            ))}
        </div>
    );
}

export default Category;
