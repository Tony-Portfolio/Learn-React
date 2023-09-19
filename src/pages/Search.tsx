import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
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
    Search: string;
    thumbnail: string;
    images: string[];
}

function Search() {
    const [products, setProducts] = useState<Product[]>([]);
    const { id } = useParams();

    useEffect(() => {
        fetch('https://dummyjson.com/products/search?q=' + id)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [id]);

    return (
        <div className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-20 min-h-[80vh] mt-4">
            {products.length === 0 ? (
                <p>No results found for "{id}"</p>
            ) : (
                products.map((product: any) => (
                    <Item product={product} key={product.id} />
                ))
            )}
        </div>
    );
}

export default Search;
