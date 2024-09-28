import DashboardLayout from "@/components/DashboardLayout";
import Loader from "@/components/Loader";
import buildClient from "@/pages/api/build-client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const CategDashboard = ({ categories }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleDelete = async (categorySlug) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this category?");
        
        if (isConfirmed) {
            setLoading(true)
            try {
                await axios.delete(`/api/v1/products/categories/${categorySlug}`);
    
                setLoading(false)
                window.location.reload()
            } catch (error) {
                setErrors(
                    error.response.data.errors || [
                        { message: "Something went wrong!" },
                    ]
                );
                setLoading(false)
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
                    Category Manajement
                </h1>

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

                <div className="relative overflow-x-auto mt-[1.5rem]">
                    <Link href={`/dashboard/category/create`}>
                        <button className={` m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-blue-500`}>Create a new category</button>
                    </Link>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Icon
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories
                                ? categories.map((category, index) => (
                                    <tr
                                        key={category.id}
                                        className="bg-white border-b "
                                    >
                                        <td className="px-6 py-4">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                        <div className="bg-black p-[1rem] w-[100px] h-[100px]">
                                            <div dangerouslySetInnerHTML={{ __html: category.svg_icon }} />
                                        </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/dashboard/category/edit/${category.slug}`}>
                                                <button className={` m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-orange-500`}>Edit</button>
                                            </Link>
                                            <button onClick={() => handleDelete(category.slug)} disabled={loading} className={`${loading ? "opacity-70" : ""} m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-red-500`}>{loading ? "Deleting..." : "Delete"}</button>
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

    const { data } = await client.get("/api/v1/products/categories");

    console.log(data)

    return {
        props: {
            categories: data.data,
        },
    };
}

export default CategDashboard;
