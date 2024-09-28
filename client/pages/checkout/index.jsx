import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import Router from "next/router";

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [shippingAddress, setShippingAddress] = useState();
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [note, setNote] = useState();

    useEffect(() => {
        // Ambil data dari local storage
        const storedItems =
            JSON.parse(localStorage.getItem("selectedItems")) || [];
        const storedTotal = localStorage.getItem("totalAmount") || 0;

        setSelectedItems(storedItems);
        setTotal(storedTotal);
    }, []);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        var orderItems = [];

        selectedItems.forEach(element => {
            var item = {
                product_id: parseInt(element.product.id, 10),
                quantity: parseInt(element.quantity, 10),
                total: parseInt(element.product.price * element.quantity, 10),
            };

            orderItems.push(item);
        });

        const requestBody = {
            total_amount: parseInt(total, 10),
            shipping_address: shippingAddress,
            payment_method: paymentMethod,
            note: note,
            order_items: orderItems
        };


        try {
            await axios.post(`/api/v1/orders`, requestBody);

            alert("success")
            Router.push("/")
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
        <>
            {loading ? <Loader /> : null}
            <section className=" antialiased dark:bg-black pt-[8rem] px-[5rem] pb-[8rem]">
                <form onSubmit={handleCheckout} className="mx-auto max-w-screen-xl  p-[3rem] shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500">
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
                    <div className="border-b-2 border-blue-700 mb-[2rem]">
                        <h1 className="text-2xl text-white font-semibold">Checkout</h1>
                        <p className="text-sm mb-1 text-white">
                            Review your items and complete your purchase. Ensure all details are correct before proceeding with payment.
                        </p>
                    </div>
                    <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
                        <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                                <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Cart
                            </span>
                        </li>

                        <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                                <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Checkout
                            </span>
                        </li>

                        <li className="flex shrink-0 items-center">
                            <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Order summary
                        </li>
                    </ol>

                    <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                        <div className="min-w-0 flex-1 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Address</h2>

                                <div className="grid grid-cols-1 ">
                                    <div>
                                        <textarea id="shipping_address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} rows="7" className="block p-2.5 w-[100%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your address here..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h3>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input id="credit-card" aria-describedby="credit-card-text" type="radio" name="payment-method" value="" className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" checked />
                                            </div>

                                            <div className="ms-4 text-sm">
                                                <label htmlFor="credit-card" className="font-medium leading-none text-gray-900 dark:text-white">Cash on Delivery </label>
                                                <p id="credit-card-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay cash when order arrives</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ">Note</h2>
                                <p id="credit-card-text" className=" mb-[1rem] text-sm font-normal text-gray-500 dark:text-gray-400">notes or messages for sellers and couriers</p>

                                <div className="grid grid-cols-1 ">
                                    <div>
                                        <textarea value={note} onChange={(e) => setNote(e.target.value)} id="note" rows="5" className="block p-2.5 w-[100%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your notes here..."></textarea>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                            <div className="flow-root border-b-2 border-blue-700">
                                <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                                    <dl className="flex items-center justify-between gap-4 py-3">
                                        <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                        <dd className="text-base font-bold text-gray-900 dark:text-white">Rp. {total}</dd>
                                    </dl>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-center">
                                    <button type="submit" className=" focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900">Proceed to Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
            {/* <div className="my-[7rem] mx-[5rem] pb-[8rem]">
                <h1 className="text-2xl font-bold mb-[2rem]">Checkout</h1>

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

                <div className="flex flex-col gap-[1.5rem]">
                    <div className="p-[2rem] bg-gray-200 flex justify-evenly">
                        <p className="text-xl font-semibold w-[30%] ">
                            Product
                        </p>
                        <div className=" flex w-[70%]">
                            <p className="text-xl font-semibold w-[25%] flex justify-center">
                                Price
                            </p>
                            <p className="text-xl font-semibold w-[25%] flex justify-center">
                                Quantity
                            </p>
                            <p className="text-xl font-semibold w-[25%] flex justify-center">
                                Total
                            </p>
                        </div>
                    </div>

                <form ref={formRef} onSubmit={handleCheckout}>
                    <div className="">
                        <div className="mb-3">
                            <label
                                htmlFor="note"
                                className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                                Note
                            </label>
                            <input
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                type="text"
                                id="note"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="shipping_address"
                                className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                                Shipping Address
                            </label>
                            <textarea
                                value={shippingAddress}
                                onChange={(e) =>
                                    setShippingAddress(e.target.value)
                                }
                                id="shipping_address"
                                rows="8"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500  "
                                placeholder="Your description here"
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="payment_method"
                                className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                                Payment Method
                            </label>
                            <select
                                id="payment_method"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                            >
                                <option value="COD">COD</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div className="w-[100%] fixed left-0 ring-0 bottom-0 p-[3rem] px-[5rem] bg-gray-400 flex justify-between">
                <div className="flex gap-[1rem] items-center">
                    <p className="font-semibold text-lg">
                        Total ({selectedItems.length} Product): Rp. {total}
                    </p>
                    <button
                        type="button"
                        onClick={() => formRef.current.requestSubmit()}
                        className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        Create Order
                    </button>
                </div>
            </div> */}
        </>
    );
};

export default Checkout;
