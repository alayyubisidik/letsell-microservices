import React, { useState } from 'react';
import AccountLayout from '@/components/AccountLayout';
import buildClient from '../../api/build-client';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/components/Loader';
import Router from 'next/router';

const MyOrder = ({ initialOrders }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [activeFilter, setActiveFilter] = useState("");
    const [orders, setOrders] = useState(initialOrders);

    const handleOrderCancel = async (orderId) => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this order?");

        if (isConfirmed) {
            setLoading(true);
            try {
                await axios.put(`/api/v1/orders/cancel/${orderId}`);
                setLoading(false);
                window.location.reload();
            } catch (error) {
                setErrors(
                    error.response.data.errors || [{ message: "Something went wrong!" }]
                );
                setLoading(false);
            }
        }

        Router.push("/account/my-order")
    }

    const handleOrderComplete = async (orderId) => {
        const isConfirmed = window.confirm("Are you sure this order is complete?");

        if (isConfirmed) {
            setLoading(true);
            try {
                await axios.put(`/api/v1/orders/complete/${orderId}`);
                setLoading(false);
                window.location.reload();
            } catch (error) {
                setErrors(
                    error.response.data.errors || [{ message: "Something went wrong!" }]
                );
                setLoading(false)
            }
        }

        Router.push("/account/my-order")
    }

    const handleOrderFilter = async (filter) => {
        setLoading(true);
        setActiveFilter(filter);
        try {
            const { data } = await axios.get(`/api/v1/orders?status=${filter}`);
            setOrders(data.data);
            setLoading(false);
        } catch (error) {
            setErrors(
                error.response.data.errors || [{ message: "Something went wrong!" }]
            );
            setLoading(false)
            window.location.reload()
        }
    }

    return (
        <AccountLayout>
            {loading && <Loader />}
            <div className="border-b-2 border-blue-700 mb-[1rem]">
                <h1 className="text-xl text-white font-semibold">My Order</h1>
                <p className="text-sm mb-1 text-white">
                    You can manage your order such as confirm order, cancel order and view details.
                </p>
            </div>


            <div className="w-[100%] flex  mb-[2rem] shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-blue-700">
                {/* Filter button */}
                <div
                    onClick={() => handleOrderFilter("")}
                    className={`p-[.5rem] text-sm sm:text-base sm:p-[.7rem] text-white hover:bg-orange-500 cursor-pointer flex justify-center items-center ${activeFilter === "" ? "bg-orange-500" : ""} `}
                >
                    <p>All</p>
                </div>
                <div
                    onClick={() => handleOrderFilter("unpaid")}
                    className={`p-[.5rem] text-sm sm:text-base sm:p-[.7rem] text-white hover:bg-orange-500 cursor-pointer flex justify-center items-center ${activeFilter === "unpaid" ? "bg-orange-500" : ""}  `}
                >
                    <p>Unpaid</p>
                </div>
                <div
                    onClick={() => handleOrderFilter("completed")}
                    className={`p-[.5rem] text-sm sm:text-base sm:p-[.7rem] text-white hover:bg-orange-500 cursor-pointer flex justify-center items-center ${activeFilter === "completed" ? "bg-orange-500" : ""}  `}
                >
                    <p>Completed</p>
                </div>
                <div
                    onClick={() => handleOrderFilter("cancelled")}
                    className={`p-[.5rem] text-sm sm:text-base sm:p-[.7rem] text-white hover:bg-orange-500 cursor-pointer flex justify-center items-center ${activeFilter === "cancelled" ? "bg-orange-500" : ""}  `}
                >
                    <p>Cancelled</p>
                </div>
            </div>

            {/* Error messages */}
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

            <div className="flex flex-col gap-[1rem] w-[100%] text-white ">
                {orders ? (
                    orders.map((order, index) => (
                        <Link key={index} href={`/account/my-order/${order.id}`}>
                            <div className="w-[100%] px-[1.7rem] py-[1.2rem] shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-blue-700 hover:shadow-red-500">
                                <div className=" mb-[1rem] flex justify-between">
                                    <p className='shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-blue-700 py-[.5rem] px-[1rem]'>{order.payment_method}</p>
                                    {order.status == "unpaid" && (
                                        <p className='shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-orange-500 py-[.5rem] px-[1rem]'>{order.status}</p>
                                    )}
                                    {order.status == "completed" && (
                                        <p className='shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-green-500 py-[.5rem] px-[1rem]'>{order.status}</p>
                                    )}
                                    {order.status == "cancelled" && (
                                        <p className='shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500 py-[.5rem] px-[1rem]'>{order.status}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-[.5rem] mt-[2rem] mb-[1rem]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg>
                                    <p >
                                        {order.shipping_address}
                                    </p>
                                </div>
                                {order.status == "unpaid" && (
                                    <>
                                        <button onClick={() => handleOrderCancel(order.id)} className="mr-[.7rem] px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">
                                            Cancel
                                        </button>
                                        <button onClick={() => handleOrderComplete(order.id)} className=" px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                                            Order Completed
                                        </button>
                                    </>
                                )}
                                <p className='mt-[1rem]'>2021-01-10</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>Order is empty</p>
                )}
            </div>

        </AccountLayout>
    );
}

export async function getServerSideProps(context) {
    const client = buildClient(context.req);
    const { data } = await client.get("/api/v1/orders/");

    return {
        props: {
            initialOrders: data.data,
        },
    };
}

export default MyOrder;
