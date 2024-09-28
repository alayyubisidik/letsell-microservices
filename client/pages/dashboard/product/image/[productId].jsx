import DashboardLayout from "@/components/DashboardLayout";
import buildClient from "@/pages/api/build-client";
import axios from "axios";
import Link from "next/link";
import React, { useRef, useState } from "react";
import Loader from "@/components/Loader";

const ProductImage = ({ productImages }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [image, setImage] = useState(null);

    const fileInputRef = useRef(null);
    const fileInputUpdateRef = useRef(null);

    const handleButtonClick = () => {
        fileInputUpdateRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("image", fileInputRef.current.files[0]);
        formData.append("product_id", productImages[0].product_id);

        try {
            await axios.post("/api/v1/products/images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            window.location.reload();
        } catch (error) {
            setErrors(
                error.response?.data?.errors || [
                    { message: "Terjadi kesalahan!" },
                ]
            ); 
        }

        setLoading(false);
    };

    const handleDelete = async (productImageId) => {
        setLoading(true);

        try {
            await axios.delete(`/api/v1/products/images/${productImageId}`);

            window.location.reload();
        } catch (error) {
            setErrors(
                error.response?.data?.errors || [
                    { message: "Terjadi kesalahan!" },
                ]
            );
        }

        setLoading(false);
    };

    const handleUpdate = async (productImageId) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("image", fileInputUpdateRef.current.files[0]);

        try {
            await axios.put(`/api/v1/products/images/${productImageId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            window.location.reload();
        } catch (error) {
            setErrors(
                error.response?.data?.errors || [
                    { message: "Terjadi kesalahan!" },
                ]
            );
        }

        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };




    return (
        <DashboardLayout>
            {loading ? <Loader /> : null}
            <h1 className="text-xl font-bold mb-[1rem]">Gambar Produk</h1>
            <div className="flex gap-[1rem]">
                <div className="w-[60%]">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Gambar
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Dibuat Pada
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productImages
                                ? productImages.map((image, index) => (
                                    <tr
                                        key={index}
                                        className="bg-white border-b "
                                    >
                                        <td className="px-6 py-4">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={image.image_url}
                                                width={200}
                                                alt=""
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(image.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                target="_blank"
                                                href={image.image_url}
                                            >
                                                <button className="m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-orange-500">
                                                    Detail
                                                </button>
                                            </Link>

                                            <button onClick={() => handleDelete(image.id)} className="m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-orange-500">
                                                Delete
                                            </button>

                                            <button onClick={handleButtonClick} className="m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-orange-500">
                                                Replace
                                            </button>

                                            <input ref={fileInputUpdateRef} onChange={() => handleUpdate(image.id)} type="file" name="image" hidden/>
                                        </td>
                                    </tr>
                                ))
                                : null}
                        </tbody>
                    </table>
                </div>
                <div className="w-[40%]">
                    <h1 className="text-xl font-bold mb-[1rem]">
                        Tambah Gambar Produk
                    </h1>
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
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="file_input"
                                >
                                    Unggah Gambar
                                </label>
                                <input
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    id="file_input"
                                    type="file"
                                />
                                <p
                                    className="mt-1 text-sm text-gray-500"
                                    id="file_input_help"
                                >
                                    SVG, PNG, JPG dan harus 1:1.
                                </p>

                                {image && (
                                    <div className="grid grid-cols-1 gap-2 mt-4">
                                        <div className="w-full pt-[100%] relative overflow-hidden rounded-lg border border-gray-300">
                                            <img
                                                src={image}
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                alt="Preview"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className={`${loading ? "opacity-70" : ""
                                } inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800`}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </form>
                </div>
            </div>
            <Link target="_blank" href={"/dashboard/product"}>
                <button className="m-[.5rem] px-4 py-2 text-white font-semibold rounded-md bg-orange-500">
                    Back
                </button>
            </Link>
        </DashboardLayout>
    );
};

export async function getServerSideProps(context) {
    const { productId } = context.params;
    const client = buildClient(context.req);

    const { data: productImage } = await client.get(
        `/api/v1/products/images/${productId}`
    );

    return {
        props: {
            productImages: productImage.data,
        },
    };
}

export default ProductImage;
