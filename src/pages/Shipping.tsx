import React from 'react';

function Shipping({ supabase }: any) {
    const [dataCheckout, setDataCheckout] = React.useState([]);
    const formatTimestamp = (timestamp: any) => {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric' as const,
            month: 'long' as const,
            day: 'numeric' as const,
            hour: 'numeric' as const,
            minute: 'numeric' as const,
            hour12: true,
        };
        const ukFormattedDate = date.toLocaleDateString('en-GB', options);
        return ukFormattedDate;
    }

    React.useEffect(() => {
        const fetchData = async () => {
            let { data: checkout, error } = await supabase
                .from('checkout')
                .select('*')

            if (error) return;
            if (checkout) setDataCheckout(checkout);

        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen p-4">
            <div className="flex items-center gap-4 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5" onClick={() => {
                    window.history.back();
                }}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <h1 className="text-xl my-1">Order History</h1>
            </div>
            {dataCheckout.length === 0 ? (
                <p className="text-lg text-gray-800 mb-8">You haven't ordered anything yet.</p>
            ) : (
                dataCheckout.map((order: any, index: any) => (
                    <div key={index} className="bg-white rounded-lg p-6 mb-8 shadow-md my-8 border-t border-black/10 border-l border-r">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            {formatTimestamp(order.created_at)}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="font-semibold text-gray-600">Full Name:</p>
                                <p className="text-lg text-gray-800">{order.fullname}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Email:</p>
                                <p className="text-lg text-gray-800">{order.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Shipping Address:</p>
                                <p className="text-lg text-gray-800">{order.address}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ordered Products:</h3>
                            {JSON.parse(order.data).map((product: any) => (
                                <div key={product.id} className="border-t pt-4 flex md:flex-row flex-col gap-4">
                                    <div className="md:w-[700px] w-full">
                                        <h4 className="text-base font-semibold text-gray-800">{product.title}</h4>
                                        <p className="text-gray-600">Description:</p>
                                        <p className="text-gray-800">{product.description}</p>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <p className="font-semibold text-gray-600">Price:</p>
                                                <p className="text-gray-800">${product.price.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-600">Brand:</p>
                                                <p className="text-gray-800">{product.brand}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-600">Quantity:</p>
                                                <p className="text-gray-800">{product.quantity}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-600">Total:</p>
                                                <p className="text-gray-800">${order.total.toFixed(2)}</p>
                                            </div>
                                            {/* Add more product details here */}
                                        </div>
                                        {/* <div className="grid grid-cols-2 gap-4 mt-4">
                                    {product.images.map((image: any, imgIndex: any) => (
                                        <img
                                            key={imgIndex}
                                            src={image}
                                            alt={`Product ${imgIndex}`}
                                            className="w-24 h-24 rounded-md"
                                        />
                                    ))}
                                </div> */}
                                    </div>
                                    <div className="w-full my-4">
                                        <img className="h-[300px] object-cover object-top rounded" src={product.thumbnail} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )
            }
        </div >
    );
}

export default Shipping;
