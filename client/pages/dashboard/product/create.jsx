import DashboardLayout from '@/components/DashboardLayout';
import Loader from '@/components/Loader';
import buildClient from '@/pages/api/build-client';
import axios from 'axios';
import Router from 'next/router';
import React, { useState } from 'react'

const CreateProduct = ({ categories }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name)
        formData.append("brand", brand)
        formData.append("price", price)
        formData.append("category_id", categoryId)
        formData.append("stock", stock)
        formData.append("description", description)
        images.forEach((image) => {
            formData.append("images", image); // Ensure the key matches the server expectation
        });

        try {
            await axios.post("/api/v1/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Router.push("/dashboard/product")
        } catch (error) {
            setErrors(
                error.response.data.errors || [
                    { message: "Something went wrong!" },
                ]
            );
        } 

        setLoading(false);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };


    return (
        <DashboardLayout>
            {loading ? (
                <Loader/>
            ) : null}
            <section className="bg-white ">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 ">Add a new product</h2>
                    <form onSubmit={handleSubmit}>
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
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Product Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " placeholder="Type product name" required="" />
                            </div>
                            <div className="w-full">
                                <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 ">Brand</label>
                                <input value={brand} onChange={(e) => setBrand(e.target.value)} type="text" name="brand" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " placeholder="Product brand" required="" />
                            </div>
                            <div className="w-full">
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 ">Price</label>
                                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " placeholder="$2999" required="" />
                            </div>
                            <div>
                                <label htmlFor="categoryId" className="block mb-2 text-sm font-medium text-gray-900 ">Category</label>
                                <select 
                                    value={categoryId || ""} 
                                    onChange={(e) => setCategoryId(e.target.value)} 
                                    id="categoryId" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                >
                                    <option value="">Select a category</option>
                                    {categories && categories.map((category, index) => (
                                        <option key={index} value={category.id}>{category.name}</option>
                                    ))}
                                </select>

                            </div>
                            <div>
                                <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900 ">Stock</label>
                                <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" name="stock" id="stock" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " placeholder="12" required="" />
                            </div>

                            <div className="sm:col-span-2">

                                <label className="block mb-2 text-sm font-medium text-gray-900 " htmlFor="file_input">Upload file</label>
                                <input multiple onChange={handleImageChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none " aria-describedby="file_input_help" id="file_input" type="file" />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG and should 1:1.</p>

                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="w-full pt-[100%] relative overflow-hidden rounded-lg border border-gray-300">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`preview-${index}`}
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 ">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500  " placeholder="Your description here"></textarea>
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
    const client = buildClient(context.req);

    const { data } = await client.get("/api/v1/products/categories");

    return {
        props: {
            categories: data.data,
        },
    };
}

export default CreateProduct