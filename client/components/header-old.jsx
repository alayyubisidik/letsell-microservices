import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";

const HeaderOld = ({ currentUser, cartItemCount }) => {
    const [loading, setLoading] = useState(false);

    const [isNavVisible, setIsNavVisible] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isAvatarVisible, setIsAvatarVisible] = useState(false);

    const toggleNavVisibility = () => {
        setIsNavVisible((prevVisibility) => !prevVisibility);
    };

    const toggleSidebarVisibility = () => {
        setIsSidebarVisible((prevVisibility) => !prevVisibility);
    };

    const toggleAvatarVisibility = () => {
        setIsAvatarVisible((prevVisibility) => !prevVisibility);
    };

    const handleSignout = async () => {
        setLoading(true);

        const response = await axios.delete("/api/v1/auth/signout");

        if (response.status === 200) {
            Router.push("/");
            setLoading(false);
        } else {
            console.log(response.data);
        }
    };

    return (
        <header className="bg-[rgba(0,0,0,.7)] fixed top-0 left-0 ring-0 z-50 w-full shadow-md shadow-blue-700">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-5"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <p className="font-bold text-3xl text-red-500 italic">Zen<span className="text-blue-700 italic">Computer</span></p>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            onClick={toggleSidebarVisibility}
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="white"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <Link
                        href="/"
                        className=" font-semibold leading-6 text-white shadow-md shadow-blue-700 hover:shadow-red-500"
                    >
                        Home
                    </Link>
                    <Link
                        href="/product"
                        className=" font-semibold leading-6 text-white shadow-md shadow-blue-700 hover:shadow-red-500"
                    >
                        Product
                    </Link>
                </div>
                <div className="hidden ml-10 justify-end lg:flex lg:flex-1 gap-[1rem]  relative">
                    {currentUser ? (
                        <>
                            <Link href={"/cart"}>
                                <div className="relative">
                                    {cartItemCount ? (
                                        <div className="absolute top-[-5px] right-[-5px] bg-red-500 rounded-full text-white w-[1rem] h-[1rem] flex justify-center items-center">
                                            <p className="text-sm">{cartItemCount}</p>
                                        </div>
                                    ) : null}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        fill="white"
                                        className="bi bi-cart3"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                    </svg>
                                </div>
                            </Link>

                            <button
                                onClick={toggleAvatarVisibility}
                                id="dropdownUserAvatarButton"
                                className="flex text-sm bg-gray-800 rounded-full md:me-0 "
                                type="button"
                            >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src={currentUser.profile_picture}
                                    alt="user photo"
                                />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href={"/auth/signup"}>
                                <button
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none"
                                >
                                    Sign Up
                                </button>
                            </Link>
                            <Link href={"/auth/signin"}>
                                <button
                                    type="button"
                                    className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none"
                                >
                                    Sign In
                                </button>
                            </Link>
                        </>
                    )}

                    <div
                        className={`absolute top-[120%] left-[75%] ${isAvatarVisible ? "block" : "hidden"
                            } z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
                    >
                        <div className="px-4 py-3 text-sm text-gray-900 ">
                            <div>
                                {currentUser ? currentUser.full_name : ""}
                            </div>
                            <div className="font-medium truncate">
                                {currentUser ? currentUser.username : ""}
                            </div>
                        </div>
                        <ul
                            className="py-2 text-sm text-gray-700 d"
                            aria-labelledby="dropdownUserAvatarButton"
                        >
                            <li>
                                <Link
                                    href="/account"
                                    className="block px-4 py-2 hover:bg-gray-100 "
                                >
                                    Account
                                </Link>
                                <Link
                                    href="/account/my-order"
                                    className="block px-4 py-2 hover:bg-gray-100 "
                                >
                                    My Order
                                </Link>
                            </li>
                            <li>
                                {currentUser && (
                                    <>
                                        {currentUser.role === "admin" ? (
                                            <Link
                                                href={`/dashboard`}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Dashboard
                                            </Link>
                                        ) : null}
                                    </>
                                )}
                            </li>
                            <div
                                onClick={handleSignout}
                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {loading ? "Signing out" : "Sign out"}
                            </div>
                        </ul>
                    </div>
                </div>
            </nav>
            <div
                className={`lg:hidden ${isSidebarVisible ? "block" : "hidden"}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="fixed inset-0 z-10"></div>
                <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <svg
                                onClick={toggleSidebarVisibility}
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="white"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    href="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/product"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Product
                                </Link>
                                <Link
                                    href="/blog"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Blog
                                </Link>
                                <div className="-mx-3">
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        aria-controls="disclosure-1"
                                        aria-expanded="false"
                                    >
                                        Categories
                                    </button>
                                    <div
                                        className="mt-2 space-y-2"
                                        id="disclosure-1"
                                    >
                                        <Link
                                            href="/"
                                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Analytics
                                        </Link>
                                    </div>
                                </div>
                                {currentUser && (
                                    <>
                                        <Link
                                            href="/account"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Account
                                        </Link>
                                        <Link
                                            href="/account/my-order"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            My Order
                                        </Link>
                                        {currentUser && (
                                            <>
                                                {currentUser.role == "admin" ? (
                                                    <Link
                                                        href={`/dashboard`}
                                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                    >
                                                        Dashboard
                                                    </Link>
                                                ) : null}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="py-6">
                                {currentUser ? (
                                    <p
                                        className="cursor-pointer"
                                        onClick={handleSignout}
                                    >
                                        Sign Out
                                    </p>
                                ) : (
                                    <>
                                        <Link
                                            href="/auth/signin"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};


export default HeaderOld;
