import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Bottom() {
    const [category, setcategory] = useState([]);
    

    useEffect(() => {
        fetch('https://dummyjson.com/products/categories')
            .then((response) => response.json())
            .then((data) => {
                setcategory(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const scrollNavigation = (direction: any) => {
        var scroll: any = document.querySelector(".scroll");
        console.log("running");
        scroll.scrollLeft += direction;
    }

    return (
        <div className="w-11/12 mx-auto flex gap-4 items-center py-2">
            <div className="max-w-full overflow-hidden relative">
                <div className="relative">
                    <div className="absolute top-[50%] translate-y-[-50%] left-[0px] md:left-0 w-[40px] h-[40px] shadow-md rounded-full flex items-center justify-center cursor-pointer" onClick={() => scrollNavigation(-300)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fill-rule="evenodd"
                                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div className="absolute top-[50%] translate-y-[-50%] right-[0px] md:right-0 w-[40px] h-[40px] shadow-md rounded-full flex items-center justify-center cursor-pointer" onClick={() => scrollNavigation(300)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fill-rule="evenodd"
                                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <ul className="navigation flex gap-2 gap-x-4 md:gap-x-8 flex-nowrap font-[500] text-black/[0.6] text-[13px] overflow-x-hidden text-center whitespace-nowrap scroll relative w-[75%] md:w-[90%] mx-auto transition duration-300 ease-in-out scroll-smooth">
                        <Link to="/">
                            <li className="py-1 relative group">
                                <img src="/icons/all.png" alt="" className="w-[25px] h-[25px] mx-auto object-cover" />
                                <p className="py-2 w-[25px]">All</p>
                                <div
                                    className="absolute bottom-0 left-0 w-full border-[1px] border-black/[0.1] opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                                </div>
                            </li>
                        </Link>
                        {category.map((result) => (
                            <Link to={`/product/category/${result}`} key={result}>
                                <li className="py-1 relative group">
                                    <img src={`/icons/${result}.png`} alt="" className="w-[28px] h-[25px] mx-auto object-cover" />
                                    <p className="py-2">{result}</p>
                                    <div className="absolute bottom-0 left-0 w-full border-[1px] border-black/[0.1] opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Bottom;