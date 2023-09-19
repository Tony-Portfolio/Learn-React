import { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
// import { useLocation } from 'react-router-dom';
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

const Index = ({ supabase }: any) => {
    // const location = useLocation();
    const [items, setItems] = useState<Product[]>([]);
    // const [checkoutData, setCheckoutData] = useState([]);
    // const [updatedItems, setUpdatedItems] = useState([]);

    // useEffect(() => {
    //     async function fetchCheckoutData() {
    //         try {
    //             const response = await supabase.from('checkout').select('data');
    //             if (response.error) {
    //                 throw new Error(response.error.message);
    //             }
    //             setCheckoutData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching checkout data:', error);
    //         }
    //     }

    //     fetchCheckoutData();
    // }, []);
    console.log(supabase);

    useEffect(() => {
        fetch('https://dummyjson.com/products?limit=100')
            .then((response) => response.json())
            .then((data) => {
                setItems(data.products);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    // const decreaseStock = (item_id: any, quantity: any) => {
    //     setItems((prevItems: any) =>
    //         prevItems.map((item: any) =>
    //             item.id === item_id
    //                 ? { ...item, stock: Math.max(item.stock - quantity, 0) }
    //                 : item
    //         )
    //     );
    // };
    // const parsedCheckoutData = checkoutData.map((dataItem) =>
    //     JSON.parse(dataItem.data)
    // );

    // // Trigger stock decrease when checkoutData changes
    // useEffect(() => {
    //     parsedCheckoutData.forEach((checkoutItem) => {
    //         checkoutItem.map((item: any) => {
    //             console.log(item.quantity);
    //             decreaseStock(item.id, item.quantity);
    //         })
    //     });
    // }, [checkoutData]);








    return (
        <div className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-20 mt-4">
            {items.map((product) => (
                <Item product={product} key={product.id} />
            ))}
        </div>
    );
}

export default Index;
