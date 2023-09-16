// import React from "react";
import { useLocation } from "react-router-dom";
import Middle from "./navigation/Middle";
import Bottom from "./navigation/Bottom";

function Navigation({ supabase }: any) {
    const location = useLocation();
    const isProductPage = location.pathname.match(/^\/product\/\d+$/);
    const isCart = location.pathname === "/cart";

    const renderBottom = !(isProductPage || isCart);

    return (
        <div className="mb-4 sticky top-0 left-0 bg-white w-full shadow-md z-10">
            {<Middle supabase={supabase} />}
            {renderBottom && <Bottom />}
        </div>
    );
}

export default Navigation;
