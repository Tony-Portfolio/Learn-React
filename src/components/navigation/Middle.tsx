import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Middle({ supabase }: any) {
    const pathname = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const [isUserLogin, setIsUserLogin] = useState(false);


    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                console.log(user);
                if (user) setIsUserLogin(true);
                else setIsUserLogin(false);
            } catch (error: any) {
                console.error('Unexpected Error:', error);
            }
        }

        getUser();
    }, [pathname])

    const logout = async () => {
        Swal.fire({
            title: 'Are you sure want to logout?',
            // text: "You won't be able to revert this!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: "You've been logout",
                    icon: "success",
                    timer: 3000,
                    willClose: async () => {
                        let { error } = await supabase.auth.signOut();
                        if(error){}
                        navigate("/");
                    }
                }
                )
            }
        })
    }



    return (
        <div className="w-11/12 mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between py-4 gap-4">
                <div className="">
                    <Link to="/">
                        <img src="/Shopify_logo.svg" alt="" className="w-[100px] shrink" />
                    </Link>
                </div>
                {/* <div className="flex-1 md:flex-none">
                    <div className="w-full">
                        <div className="relative">
                            <form>
                                <input type="text" placeholder="search product"
                                    className="flex border-2 border-black/[0.1] shadow-lg py-3 px-4 pr-14 rounded-full text-[14px] font-[500] block md:w-[350px] w-full lg:focus:w-[450px]"
                                    name="q" />
                            </form>
                            <Link to="`/search/${search}?q${search}`">
                                <div
                                    className="w-[35px] h-[35px] text-white rounded-full bg-[#9333ea] flex items-center justify-center p-2 absolute top-[50%] right-[10px] translate-y-[-50%]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        className="w-12 h-12">
                                        <path fill-rule="evenodd"
                                            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div> */}
                <div className="items-center gap-4 justify-end flex">
                    <Link to="/cart">
                        <div className="flex items-center relative">
                            <div
                                className="text-[13px] cursor-pointer bg-[#9333ea] text-white w-[25px] h-[25px] flex items-center justify-center absolute top-[-10px] right-[-10px] rounded-full">
                                <p>?</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" className="w-8 h-8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                    </Link>
                    <div className="flex items-center p-1 border-[1px] border-black/[0.1] rounded-full gap-1 relative shadow-md">
                        <div className="flex items-center gap-1 cursor-pointer" onClick={toggleMenu}>
                            <div className="mx-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </div>
                            <img src="/profile.png" className="w-[40px] h-[40px] rounded-full object-cover object-top" />
                        </div>
                        <div
                            className={`absolute bg-white top-[120%] right-0 w-[240px] z-[40] shadow-lg shadow-black/20 rounded-lg flex flex-col gap-3 ${isMenuOpen ? 'block' : 'hidden'}`}>
                            <div className={`${isUserLogin ? 'hidden' : 'block'}`}>
                                <Link to="/register">
                                    <p className="hover:bg-black/[0.03] py-3 text-[15px] px-4 cursor-pointer">Sign Up</p>
                                </Link>
                                <Link to="/login">
                                    <p className="hover:bg-black/[0.03] py-3 text-[15px] px-4 cursor-pointer">Login</p>
                                </Link>
                            </div>
                            <div className={`${isUserLogin ? 'block' : 'hidden'}`}>
                                {/* <Link to="/user/profile" onClick={toggleMenu}>
                                    <p className="hover:bg-black/[0.03] py-3 text-[15px] px-4 cursor-pointer">Profile</p>
                                </Link> */}
                                {/* <hr /> */}
                                <Link to="/cart" onClick={toggleMenu}>
                                    <p className="hover:bg-black/[0.03] py-3 text-[15px] px-4 cursor-pointer">Cart</p>
                                </Link>
                                <hr />
                                <p onClick={() => {
                                    logout()
                                    toggleMenu()
                                }}>
                                    <p className="hover:bg-black/[0.03] py-3 text-[15px] px-4 cursor-pointer">Logout</p>
                                </p>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div>
    )
}
export default Middle;