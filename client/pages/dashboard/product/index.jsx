import DashboardLayout from "@/components/DashboardLayout";
import Loader from "@/components/Loader";
import buildClient from "@/pages/api/build-client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const ProductDashboard = ({ products }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (productSlug) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");
        
        if (isConfirmed) {
            setLoading(true)
            try {
                await axios.delete(`/api/v1/products/${productSlug}`);
    
                setLoading(false)
                window.location.reload()
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("An error occurred. Please try again.");
            }
        }
    };
    

    return (
        <DashboardLayout>
            {loading ? (
                <Loader/>
            ) : null}
            <div>
                <h1 className="text-xl font-bold mb-[1rem]">
                    Product Manajement
                </h1>

                <div className="relative overflow-x-auto mt-[1.5rem]">
                    <Link href={`/dashboard/product/create`}>
                        <button className={` m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-blue-500`}>Create a new product</button>
                    </Link>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Brand
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Stock
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products
                                ? products.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="bg-white border-b "
                                    >
                                        <td className="px-6 py-4">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={product.product_images[0].image_url}
                                                width={200}
                                                alt=""
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.category.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.brand}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/product/${product.slug}`}>
                                                <button className={` m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-blue-400`}>Detail</button>
                                            </Link>
                                            <Link href={`/dashboard/product/edit/${product.slug}`}>
                                                <button className={` m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-orange-500`}>Edit</button>
                                            </Link>
                                            <button onClick={() => handleDelete(product.slug)} disabled={loading} className={`${loading ? "opacity-70" : ""} m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-red-500`}>{loading ? "Deleting..." : "Delete"}</button>
                                        </td>
                                    </tr>
                                ))
                                : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export async function getServerSideProps(context) {
    const client = buildClient(context.req);

    const { data } = await client.get("/api/v1/products/");

    return {
        props: {
            products: data.data,
        },
    };
}

export default ProductDashboard;
