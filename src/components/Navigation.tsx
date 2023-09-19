// import React from "react";
import { useLocation, Link } from "react-router-dom";
import Middle from "./navigation/Middle";
import Bottom from "./navigation/Bottom";

function Navigation({ supabase }: any) {
    const location = useLocation();
    const isProductPage = location.pathname.match(/^\/product\/\d+$/);
    const isCart = location.pathname === "/cart";
    const isCheckout = location.pathname === "/checkout";
    const isShipping = location.pathname === "/shipping";

    const renderBottom = !(isProductPage || isCart || isCheckout || isShipping);

    return (
        <div className="sticky top-0 left-0 bg-white w-full shadow-md z-10">
            {<Middle supabase={supabase} />}
            {renderBottom && <Bottom />}
            <Link to="/"><svg xmlns="http://www.w3.org/2000/svg" className="bg-purple-600 p-3 w-[60px] h-[60px] rounded-full fixed bottom-5 right-5 md:bottom-10 md:right-10" height="1em" viewBox="0 0 576 512" fill="white"><path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z" /></svg></Link>
        </div>
    );
}

export default Navigation;
