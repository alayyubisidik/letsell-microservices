import AccountLayout from '@/components/AccountLayout'
import Loader from '@/components/Loader';
import buildClient from '@/pages/api/build-client';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react'

const OrderDetail = ({ order }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [rating, setRating] = useState();
    const [review, setReview] = useState();
    const [selectedOrderItemId, setSelectedOrderItemId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [images, setImages] = useState([]);

    const handleShowModal = (orderItemId) => {
        setSelectedOrderItemId(orderItemId);
        setShowModal(true);
    }

    const handleGiveRating = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("order_item_id", selectedOrderItemId)
        formData.append("rating", rating)
        formData.append("review", review)
        images.forEach((image) => {
            formData.append("rating_images", image); // Ensure the key matches the server expectation
        });

        try {
            await axios.post("/api/v1/ratings", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            window.location.reload()
        } catch (error) {
            setErrors(
                error.response.data.errors || [
                    { message: "Something went wrong!" },
                ]
            );
        }

        setLoading(false);
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    return (
        <AccountLayout>
            {loading ? (
                <Loader />
            ) : null}
            <div className='text-white'>
                <div className="border-b-2 border-blue-700 mb-[1rem]">
                    <h1 className="text-xl text-white font-semibold">Detail Order</h1>
                    <p className="text-sm mb-1 text-white">
                        You can view your order details and rate the product.
                    </p>
                </div>

                {order ? (
                    <div className='my-[1rem] bg-gray-500 bg-opacity-50 p-[1rem] block text-[13px] md:text-base'>
                        <div className='flex '>
                            <p className='w-[25%] xl:w-[10%]'>Status</p>
                            <span className='mr-[.2rem]'>:</span>
                            <p className='w-[80%]'>{order.status}</p>
                        </div>
                        <div className='flex '>
                            <p className='w-[25%] xl:w-[10%]'>Total Amount</p>
                            <span className='mr-[.2rem]'>:</span>
                            <p className='w-[80%]'>Rp. {order.total_amount}</p>
                        </div>
                        <div className='flex '>
                            <p className='w-[25%] xl:w-[10%]'>Payment Method</p>
                            <span className='mr-[.2rem]'>:</span>
                            <p className='w-[80%]'>{order.payment_method}</p>
                        </div>
                        <div className='flex '>
                            <p className='w-[25%] xl:w-[10%]'>Shipping Address</p>
                            <span className='mr-[.2rem]'>:</span>
                            <p className='w-[80%]'>{order.shipping_address}</p>
                        </div>
                        <div className='flex '>
                            <p className='w-[25%] xl:w-[10%]'>Note</p>
                            <span className='mr-[.2rem]'>:</span>
                            <p className='w-[80%]'>{order.note}</p>
                        </div>
                        <div className='flex '>
                            <p className='w-[25%] xl:w-[10%]'>Created At</p>
                            <span className='mr-[.2rem]'>:</span>
                            <p className='w-[80%]'>{order.created_at}</p>
                        </div>
                    </div>
                ) : null}

                <div className="border-b-2 mt-[2rem] border-blue-700 mb-[1rem]">
                    <h1 className="text-lg text-white font-semibold">Order Item</h1>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-16 py-3">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order ? (
                                order.order_items.map((item, index) => (
                                    <tr key={index} className=" border-b bg-gray-800 border-gray-700 ">
                                        <td className="p-4">
                                            <img src={item.product.image_url} className="w-[3rem] md:w-[6rem] max-w-full max-h-full" alt="Apple Watch" />
                                        </td>
                                        <td className="px-6 py-4 font-semibold  text-white">
                                            {item.product.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.product.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4  dark:text-white">
                                            Rp. {item.total}
                                        </td>
                                        <td className="px-6 py-4  ">
                                            <Link href={`/product/${item.product.slug}`}>
                                                <button type="button" className="px-3 mb-[.5rem] lg:mr-[.5rem] py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">Detail</button>
                                            </Link>
                                            {order.status === "completed" && item.is_rated == false ? (
                                                <button onClick={() => handleShowModal(item.id)} type="button" className="px-3 py-2 text-sm font-medium text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 ">Rate</button>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>
                </div>
                {/* Modal untuk memberi rating */}
                {showModal && (
                    <div id="static-modal" data-modal-backdrop="static" tabIndex="-1" className="bg-[rgba(0,0,0,0.5)] flex justify-center items-center w-[100%] h-[100%] z-50 absolute top-0 left-0 ring-0 bottom-0">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-gray-950 shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500 rounded-lg text-white">
                                <div className="flex items-center justify-start p-4 md:p-5 border-b rounded-t ">
                                    <h3 className="text-xl font-semibold ">
                                        Give a rating to the product
                                    </h3>
                                </div>
                                <div className="p-4 md:p-5 space-y-4">
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
                                    <div className="mb-5">
                                        <label htmlFor="review" className="block mb-2 text-sm font-medium ">Rating</label>
                                        <div className="flex gap-[.5rem]">
                                            <input onChange={(e) => setRating(e.target.value)} type="radio" value="1" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  " />
                                            <input onChange={(e) => setRating(e.target.value)} type="radio" value="2" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  " />
                                            <input onChange={(e) => setRating(e.target.value)} type="radio" value="3" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  " />
                                            <input onChange={(e) => setRating(e.target.value)} type="radio" value="4" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  " />
                                            <input onChange={(e) => setRating(e.target.value)} type="radio" value="5" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  " />
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="review" className="block mb-2 text-sm font-medium ">Review</label>
                                        <input onChange={(e) => setReview(e.target.value)} type="text" id="review" className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5 " placeholder="wah ini keren banget" required />
                                    </div>
                                    <div className="mb-5">
                                        <label className="block mb-2 text-sm font-medium  " htmlFor="file_input">Upload Image Review</label>
                                        <input multiple onChange={handleImageChange} className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5" aria-describedby="file_input_help" id="file_input" type="file" />
                                        <p className="mt-1 text-sm text-gray-500 " id="file_input_help">SVG, PNG, JPG, max 5 files and should 1:1.</p>

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
                                </div>
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
                                    <button onClick={handleGiveRating} data-modal-hide="static-modal" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Rate</button>
                                    <button onClick={() => setShowModal(false)} data-modal-hide="static-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-black focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AccountLayout>
        // <AccountLayout>
        //     {loading ? (
        //         <Loader/>
        //     ) : null}
        //     <div>
        //         <h1 className='text-xl font-semibold mb-[2rem]'>Order Detail</h1>

        //         {order ? (
        //             <>
        //                 <p className='mb-[.3rem]'>{order.status}</p>    
        //                 <p className='mb-[.3rem]'>{order.total_amount}</p>    
        //                 <p className='mb-[.3rem]'>{order.payment_method}</p>    
        //                 <p className='mb-[.3rem]'>{order.shipping_address}</p>    
        //                 <p className='mb-[.3rem]'>{order.note}</p>    
        //                 <p className='mb-[.3rem]'>{order.created_at}</p>   

        //                 <div className="flex flex-col gap-[1rem] w-[100%] mb-[1rem]">

        //                     {order.order_items.map((item, index) => (
        //                         <div key={index} className="w-[100%] p-[2rem] border-2 border-gray-500">
        //                             <p className='mb-[.3rem]'>Quantity : {item.quantity}</p>   
        //                             <p className='mb-[.3rem]'>Total : {item.total}</p>   
        //                             <div className=" flex  gap-[1rem] mb-[1rem]">
        //                                 <img src={item.product.image_url} alt="" />
        //                                 <div className="">
        //                                     <p className='mb-[.5rem]'>{item.product.name}</p>
        //                                     <p className='mb-[.5rem]'>{item.product.price}</p>
        //                                 </div>
        //                             </div>
        //                             {order.status === "completed" && item.is_rated == false ?  (
        //                                 <button onClick={() => handleShowModal(item.id)} data-modal-target="static-modal" data-modal-toggle="static-modal"  className="m-[.5rem] px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600">
        //                                     Rate
        //                                 </button>
        //                             ) : null}
        //                         </div>
        //                     ))}                  
        //                 </div>
        //             </>

        //         ) : null}
        //     </div>
        //      {/* Modal untuk memberi rating */}
        //     {showModal && (
        //         <div id="static-modal" data-modal-backdrop="static" tabIndex="-1" className="bg-[rgba(0,0,0,0.5)] flex justify-center items-center w-[100%] h-[100%] z-50 absolute top-0 left-0 ring-0 bottom-0">
        //             <div className="relative p-4 w-full max-w-2xl max-h-full">
        //                 <div className="relative bg-white rounded-lg shadow ">
        //                     <div className="flex items-center justify-start p-4 md:p-5 border-b rounded-t ">
        //                         <h3 className="text-xl font-semibold ">
        //                         Give a rating to the product
        //                         </h3>
        //                     </div>
        //                     <div className="p-4 md:p-5 space-y-4">
        //                         {errors.length > 0 && (
        //                             <div
        //                                 className="p-4 mb-4 text-sm text-red-700 rounded-lg bg-red-300"
        //                                 role="alert"
        //                             >
        //                                 <ul>
        //                                     {errors.map((error, index) => (
        //                                         <li key={index}>{error.message}</li>
        //                                     ))}
        //                                 </ul>
        //                             </div>
        //                         )}
        //                         <div className="mb-5">
        //                             <label htmlFor="review" className="block mb-2 text-sm font-medium ">Rating</label>
        //                             <div className="flex gap-[.5rem]">
        //                                 <input onChange={(e) => setRating(e.target.value)} type="radio" value="1" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  "/>
        //                                 <input onChange={(e) => setRating(e.target.value)} type="radio" value="2" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  "/>
        //                                 <input onChange={(e) => setRating(e.target.value)} type="radio" value="3" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  "/>
        //                                 <input onChange={(e) => setRating(e.target.value)} type="radio" value="4" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  "/>
        //                                 <input onChange={(e) => setRating(e.target.value)} type="radio" value="5" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2  "/>
        //                             </div>
        //                         </div>
        //                         <div className="mb-5">
        //                             <label htmlFor="review" className="block mb-2 text-sm font-medium ">Review</label>
        //                             <input onChange={(e) => setReview(e.target.value)} type="text" id="review" className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="wah ini keren banget" required />
        //                         </div>
        //                         <div className="mb-5">
        //                             <label className="block mb-2 text-sm font-medium  " htmlFor="file_input">Upload Image Review</label>
        //                             <input multiple onChange={handleImageChange} className="block w-full text-sm  border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none " aria-describedby="file_input_help" id="file_input" type="file" />
        //                             <p className="mt-1 text-sm text-gray-500 " id="file_input_help">SVG, PNG, JPG, max 5 files and should 1:1.</p>

        //                             <div className="grid grid-cols-3 gap-2 mt-4">
        //                                 {images.map((image, index) => (
        //                                     <div key={index} className="w-full pt-[100%] relative overflow-hidden rounded-lg border border-gray-300">
        //                                         <img
        //                                             src={URL.createObjectURL(image)}
        //                                             alt={`preview-${index}`}
        //                                             className="absolute top-0 left-0 w-full h-full object-cover"
        //                                         />
        //                                     </div>
        //                                 ))}
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
        //                         <button onClick={handleGiveRating} data-modal-hide="static-modal" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Rate</button>
        //                         <button onClick={() => setShowModal(false)} data-modal-hide="static-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium  focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">Back</button>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        // </AccountLayout>
    )
}

export async function getServerSideProps(context) {
    const { orderId } = context.params;

    const client = buildClient(context.req);

    const { data } = await client.get(`/api/v1/orders/${orderId}`);

    return {
        props: {
            order: data.data,
        },
    };
}

export default OrderDetail