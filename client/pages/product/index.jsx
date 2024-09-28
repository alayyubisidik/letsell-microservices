import Link from "next/link";
import React, { useEffect, useState } from "react";
import buildClient from "../api/build-client";
import axios from "axios";

const Product = ({ initialProducts, categories }) => {
    const [categorySlug, setCategorySlug] = useState("");
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const handleCategorySelect = async (category) => {
        localStorage.removeItem("categorySlug")
        setCategorySlug(category)
        setSearch(category);
        setIsDropdownVisible(false);
        try {
            const { data } = await axios.get(
                `/api/v1/products?search=${category}&page=${page}&limit=${limit}`
            );
            setProducts(data.data);
        } catch (error) {
            console.log(error)
        }
    };

    const handleSearch = async (searchQuery) => {
        localStorage.removeItem("categorySlug")
        setCategorySlug("")
        try {
            const { data } = await axios.get(
                `/api/v1/products?search=${searchQuery}&page=${page}&limit=${limit}`
            );
            setProducts(data.data);
        } catch (error) {
            console.log(error)
        }
    };

    const handlePageChange = async (newPage) => {
        localStorage.removeItem("categorySlug")
        try {
            const { data } = await axios.get(`/api/v1/products?search=${search}&page=${newPage}&limit=${limit}`);
            setProducts(data.data);
            setPage(newPage);
        } catch (error) {
            console.log(error)
        }
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    useEffect(() => {
        const storedCategorySlug = localStorage.getItem("categorySlug") || "";

        if (storedCategorySlug !== "") {
            handleCategorySelect(storedCategorySlug);
        }
    }, []);

    return (
        <div className="pt-[8rem] pb-[5rem] flex flex-col justify-center items-center bg-black">
            <form className="w-[80%] mx-auto mb-[2rem]">
                <div className="flex relative">
                    <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium sr-only text-white">Search</label>
                    <button
                        id="dropdown-button"
                        className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border rounded-s-lg focus:ring-4 focus:outline-none bg-gray-900 hover:bg-gray-950 focus:ring-gray-900 text-white border-gray-80"
                        type="button"
                        onClick={toggleDropdown}
                    >
                        {categorySlug || "All categories"}
                        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <div className={`z-10 ${isDropdownVisible ? '' : 'hidden'} rounded-lg shadow w-44 bg-gray-700 absolute top-[100%]`}>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                            {categories && categories.map((category, index) => (
                                <li key={index}>
                                    <button
                                        type="button"
                                        className="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                                        onClick={() => handleCategorySelect(category.slug)}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative w-full">
                        <input
                            type="search"
                            id="search-dropdown"
                            className="block p-2.5 w-full z-20 text-sm rounded-e-lg border-s-gray-50 border-s-2 border focus:ring-blue-800 bg-gray-900 border-gray-800 placeholder-gray-900 text-white focus:border-blue-800"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}  // Update query saat mengetik
                            required
                        />
                        <button
                            type="submit"
                            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSearch(search);  // Panggil API saat submit
                            }}
                        >
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                </div>
            </form>

            <div className="w-[80%] min-h-[100vh] shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500 grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-[.5rem] p-[2rem]">
                {products ? (
                    products.map((product, index) => (
                        <Link key={index} href={`/product/${product.slug}`}>
                            <div className="w-[15rem] h-[23rem] shadow-[0_0_7px_0_rgba(0,0,0,0.9)] shadow-blue-700 hover:scale-105 bg-black hover:shadow-red-700 transition">
                                <div className="w-[100%] mb-[.5rem]">
                                    <img className="w-[100%]" src={product.product_images[0].image_url} alt={product.name} />
                                </div>
                                <div className="p-[.5rem]">
                                    <p className="text-white font-semibold mb-[.1rem]">{product.name}</p>
                                    <p className="text-white text-[12px] mb-[.5rem]">{product.category.name}</p>
                                    <p className="text-orange-500 text-lg font-semibold">RP. {product.price}</p>

                                    <div className="flex gap-[.5rem] items-center pl-[.5rem]">
                                        <div className="flex items-center">
                                            {/* Loop to render stars */}
                                            {Array.from({ length: 5 }, (_, starIndex) => (
                                                <svg
                                                    key={starIndex}
                                                    className={`w-4 h-4 ${starIndex < product.avg_rating ? 'text-yellow-300' : 'text-gray-500'} ms-1`}
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 22 20"
                                                >
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                            ))}
                                        </div>

                                        {/* Replace 10 with product.sold_count */}
                                        <p className="text-white text-sm">{product.sold_count} sold</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-white">No products found</p>
                )}
            </div>

            <div className="flex justify-center mt-[5rem]">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-blue-500 cursor-pointer hover:shadow-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#1d4ed8" className="bi bi-caret-left " viewBox="0 0 16 16">
                        <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                    </svg>
                </button>
                <div className="flex justify-center items-center">
                    <span className="mx-4 text-lg text-white">{page}</span>
                </div>
                <button onClick={() => handlePageChange(page + 1)} className="shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-blue-500 cursor-pointer hover:shadow-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#1d4ed8" className="bi bi-caret-right" viewBox="0 0 16 16">
                        <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

// getServerSideProps untuk mendapatkan data awal produk dan kategori
export async function getServerSideProps(context) {
    const client = buildClient(context.req);

    const { data: products } = await client.get("/api/v1/products/?search=&page=1&limit=10"); // limit default
    const { data: categories } = await client.get("/api/v1/products/categories");

    return {
        props: {
            initialProducts: products.data,
            categories: categories.data,
        },
    };
}

export default Product;
