import DashboardLayout from '@/components/DashboardLayout';
import Loader from '@/components/Loader';
import buildClient from '@/pages/api/build-client';
import axios from 'axios';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'

const EditCategory = ({ category }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState("");
    const [svgIcon, setSvgIcon] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setImage(category.svg_icon);
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name)
        formData.append("svg_icon", svgIcon)

        try {
            await axios.put(`/api/v1/products/categories/${category.slug}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Router.push("/dashboard/category")
        } catch (error) {
            setErrors(
                error.response.data.errors || [
                    { message: "Something went wrong!" },
                ]
            );
        }

        setLoading(false);
    };

    return (
        <DashboardLayout>
            {loading ? (
                <Loader />
            ) : null}
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
            <section className="bg-white ">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 ">Edit category</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Product Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " placeholder="Type product name" required="" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="svg_icon" className="block mb-2 text-sm font-medium text-gray-900 ">SVG Icon</label>
                                <textarea value={svgIcon} onChange={(e) => setSvgIcon(e.target.value)} id="svg_icon" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Put SVG Icon here..."></textarea>
                            </div>
                            <div className="bg-black p-[1rem]  w-[100px] h-[100px] flex justify-center items-center">
                                <div dangerouslySetInnerHTML={{ __html: svgIcon }} />
                            </div>
                        </div>
                        <button disabled={loading} type="submit" className={` ${loading ? "opacity-70" : ""} inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800`}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </form>
                </div>
            </section>
        </DashboardLayout>
    )
}

export async function getServerSideProps(context) {
    const { categorySlug } = context.params;
    const client = buildClient(context.req);

    const { data } = await client.get(`/api/v1/products/categories/${categorySlug}`);

    return {
        props: {
            category: data.data,
        },
    };
}

export default EditCategory