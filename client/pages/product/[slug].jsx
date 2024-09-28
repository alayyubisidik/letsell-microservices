import React, { useEffect, useState } from "react";
import buildClient from "../api/build-client";
import Loader from "@/components/Loader";
import axios from "axios";

const ProductDetail = ({ product, ratings }) => {

    console.log(ratings)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [quantity, setQuantity] = useState(1)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const body = {
            product_id: product.id,
            quantity: quantity
        }

        try {
            await axios.post("/api/v1/carts/items", body);

            alert("success")

            window.location.reload();
        } catch (error) {
            setErrors(
                error.response.data.errors || [
                    { message: "Something went wrong!" },
                ]
            );
        }

        setLoading(false);
    }

    const updateQuantity = (value) => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + value;
            return Math.min(Math.max(newQuantity, 1), 50); // Tetap dalam batas 1 hingga 50
        });
    };

    return (
        <>
            {loading ? <Loader /> : null}
            {product ? (
                <section className="py-[10rem] bg-black  antialiased">
                    <div className=" shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500  max-w-screen-xl p-[3rem] mx-auto ">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">

                            <div id="controls-carousel" className="relative w-full" data-carousel="static">
                                <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                                    {product.product_images.map((image, index) => (
                                        <div
                                            key={index}
                                            className=" duration-700 ease-in-out"
                                            data-carousel-item={index === 0 ? 'active' : ''}
                                        >
                                            <img
                                                src={image.image_url}
                                                className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                                alt={`Product image ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                                    <span className="inline-flex bg-white hover:bg-gray-400 items-center justify-center w-10 h-10 rounded-full  group-focus:outline-none">
                                        <svg className="w-4 h-4 text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                                        </svg>
                                        <span className="sr-only">Previous</span>
                                    </span>
                                </button>
                                <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                                    <span className="inline-flex bg-white hover:bg-gray-400 items-center justify-center w-10 h-10 rounded-full group-focus:outline-none">
                                        <svg className="w-4 h-4  text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                        <span className="sr-only">Next</span>
                                    </span>
                                </button>
                            </div>

                            <div className="mt-6 sm:mt-8 lg:mt-0">
                                <h1 className="text-xl font-semibold text-white sm:text-2xl ">
                                    {product.name}
                                </h1>
                                <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                                    <p className="text-2xl font-extrabold text-white sm:text-3xl ">
                                        RP. {product.price}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }, (_, starIndex) => (
                                                <svg
                                                    key={starIndex}

                                                    className={`w-4 h-4 ${starIndex < ratings.meta.avg_rating ? 'text-yellow-300' : 'text-gray-500'}`}
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium leading-none text-gray-500 ">
                                            {ratings.meta.avg_rating}
                                        </p>
                                        <a
                                            href="#"
                                            className="text-sm font-medium leading-none text-white underline hover:no-underline "
                                        >
                                            {ratings.length}
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                                    {errors.length > 0 && (
                                        <div
                                            className="p-4 mb-4 text-sm text-red-700 rounded-lg bg-red-300"
                                            role="alert"
                                        >
                                            <ul>
                                                {errors.map((error, index) => (
                                                    <li key={index}>{error.message}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="shadow md rounded-md">

                                        <form className="max-w-xs mx-auto" onSubmit={handleSubmit}>
                                            <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-white ">Choose quantity:</label>
                                            <div className="relative flex items-center max-w-[8rem] mb-[.5rem]">
                                                <button onClick={() => updateQuantity(-1)} type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-900  hover:bg-gray-800 border border-gray-700 rounded-s-lg p-3 h-11 focus:ring-gray-800  focus:ring-2 focus:outline-none">
                                                    <svg className="w-3 h-3 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                                    </svg>
                                                </button>
                                                <input value={quantity} onChange={(e) => setQuantity(Math.min(Math.max(Number(e.target.value), 1), 50))} type="number" id="quantity-input" data-input-counter data-input-counter-min="1" data-input-counter-max="50" aria-describedby="helper-text-explanation" className="text-white bg-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 " required />
                                                <button onClick={() => updateQuantity(1)} type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-900  hover:bg-gray-800 border border-gray-700 rounded-s-lg p-3 h-11 focus:ring-gray-800  focus:ring-2 focus:outline-none">
                                                    <svg className="w-3 h-3 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className='text-white mb-[.5rem]'>Stock : {product.stock}</p>
                                            <button type="submit" className=" flex justify-center items-center gap-[.2rem] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-cart-plus" viewBox="0 0 16 16">
                                                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
                                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                                </svg>
                                                <p>Add to Cart</p>
                                            </button>
                                        </form>

                                    </div>
                                </div>

                                <hr className="my-[1rem] md:my-[1.5rem] border-blue-700 " />

                                <p className=' text-gray-400 text-sm'>Category : <span className='font-semibold text-base text-white'>{product.category.name}</span></p>
                                <p className=' text-gray-400 text-sm'>Brand : <span className='font-semibold text-base text-white'>{product.brand}</span></p>



                            </div>
                            <div className="text-white border-t-2 border-blue-700 pt-[1rem]">
                                <p className='text-xl font-semibold mb-[1rem]'>Description</p>

                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className=" shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500  max-w-screen-xl p-[3rem] mx-auto mt-[2rem]">
                        <section className="  antialiased ">
                            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reviews</h2>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }, (_, starIndex) => (
                                                <svg
                                                    key={starIndex}

                                                    className={`w-4 h-4 ${starIndex < ratings.meta.avg_rating ? 'text-yellow-300' : 'text-gray-500'}`}
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium leading-none text-gray-500 ">
                                            {ratings.meta.avg_rating}
                                        </p>
                                        <a
                                            href="#"
                                            className="text-sm font-medium leading-none text-white underline hover:no-underline "
                                        >
                                            {ratings.length}
                                        </a>
                                    </div>
                                </div>

                                <div className="my-6 gap-8 sm:flex sm:items-start md:my-8 border-b-2 pb-[2rem] border-blue-700">
                                    <div className="shrink-0 space-y-4">
                                        <p className="text-2xl font-semibold leading-none text-gray-900 dark:text-white">{ratings.meta.avg_rating} out of 5</p>
                                        <button type="button" data-modal-target="review-modal" data-modal-toggle="review-modal" className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Write a review</button>
                                    </div>

                                    <div className="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
                                        <div className="flex items-center gap-2">
                                            <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">5</p>
                                            <svg className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                            </svg>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>

                                            </div>
                                            <a href="#" className="w-8 shrink-0 text-right text-sm font-medium leading-none text-blue-700 hover:underline dark:text-blue-500 sm:w-auto sm:text-left">{ratings.meta.rating_count.rating_1} <span className="hidden sm:inline">reviews</span></a>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">4</p>
                                            <svg className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                            </svg>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>

                                            </div>
                                            <a href="#" className="w-8 shrink-0 text-right text-sm font-medium leading-none text-blue-700 hover:underline dark:text-blue-500 sm:w-auto sm:text-left">{ratings.meta.rating_count.rating_2} <span className="hidden sm:inline">reviews</span></a>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">3</p>
                                            <svg className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                            </svg>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>


                                            </div>
                                            <a href="#" className="w-8 shrink-0 text-right text-sm font-medium leading-none text-blue-700 hover:underline dark:text-blue-500 sm:w-auto sm:text-left">{ratings.meta.rating_count.rating_3}<span className="hidden sm:inline">reviews</span></a>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">2</p>
                                            <svg className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                            </svg>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>


                                            </div>
                                            <a href="#" className="w-8 shrink-0 text-right text-sm font-medium leading-none text-blue-700 hover:underline dark:text-blue-500 sm:w-auto sm:text-left">{ratings.meta.rating_count.rating_4}<span className="hidden sm:inline">reviews</span></a>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">1</p>
                                            <svg className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                            </svg>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>


                                            </div>
                                            <a href="#" className="w-8 shrink-0 text-right text-sm font-medium leading-none text-blue-700 hover:underline dark:text-blue-500 sm:w-auto sm:text-left">{ratings.meta.rating_count.rating_5}<span className="hidden sm:inline">reviews</span></a>
                                        </div>
                                    </div>
                                </div>

                                {ratings.data.map((rating, index) => (
                                    <div key={index}>
                                        <div className="mt-[3rem] divide-y divide-gray-200   dark:divide-gray-700">
                                            <div className="gap-3 pb-6 sm:flex sm:items-start">
                                                <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 5 }, (_, starIndex) => (
                                                            <svg key={starIndex} className={`h-4 w-4 ${starIndex < ratings.meta.avg_rating ? 'text-yellow-300' : 'text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                                            </svg>
                                                        ))}
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <p className="text-base font-semibold text-gray-900 dark:text-white">{rating.user.full_name}</p>
                                                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{rating.created_at}</p>
                                                    </div>

                                                    <div className="inline-flex items-center gap-1">
                                                        <svg className="h-5 w-5 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Verified purchase</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                                                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">{rating.review}</p>

                                                </div>
                                            </div>
                                        </div>
                                        <hr className=" border-blue-700 w-[40%] " />
                                    </div>
                                ))}

                            </div>
                        </section>

                    </div>
                </section>
            ) : null}
        </>
    );
};

export async function getServerSideProps(context) {
    const { slug } = context.params;

    const client = buildClient(context.req);

    const { data: product } = await client.get(`/api/v1/products/${slug}`);
    const { data: ratings } = await client.get(`/api/v1/ratings/${product.data.id}`);

    return {
        props: {
            product: product.data,
            ratings: ratings,
        },
    };
}

export default ProductDetail;
