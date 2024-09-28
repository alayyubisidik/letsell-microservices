import React, { useState } from 'react'
import buildClient from '../api/build-client';
import axios from 'axios';
import Loader from '@/components/Loader';
import Link from 'next/link';

const Cart = ({ cart }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [total, setTotal] = useState(0);

    const handleDelete = async (cartItemId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");

        if (isConfirmed) {
            setLoading(true)
            try {
                await axios.delete(`/api/v1/carts/${cartItemId}`);

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
    }

    const handleDeleteAllItem = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete all item?");

        if (isConfirmed) {
            setLoading(true)
            try {
                await axios.delete(`/api/v1/carts/clear`);

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
    }

    const handleCheckboxChange = (item, isChecked) => {
        let updatedItems = [...selectedItems];
        if (isChecked) {
            updatedItems.push(item);
        } else {
            updatedItems = updatedItems.filter((selectedItem) => selectedItem.id !== item.id);
        }
        setSelectedItems(updatedItems);
        calculateTotal(updatedItems);
    }

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        setTotal(totalAmount);
    }

    const handleClickCheckout = () => {
        if (selectedItems.length > 0) {
            localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
            localStorage.setItem('totalAmount', total);
            window.location.href = '/checkout';
        } else {
            setErrors([{ message: "please check the product first" }])
        }
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : null}
            <div className='py-[7rem] px-[5rem] pb-[8rem] bg-black'>
                <div className="border-b-2 border-blue-700 mb-[2rem]">
                    <h1 className="text-2xl text-white font-semibold">Cart</h1>
                    <p className="text-sm mb-1 text-white">
                        You can arrange all the items in the cart and you can also proceed to the checkout process.
                    </p>
                </div>

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

                <section className=" py-8 antialiased shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-blue-700 md:py-16">
                    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                        <h2 className="text-xl font-semibold  text-white sm:text-2xl">Shopping Cart</h2>

                        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">

                            <div className="flex flex-col gap-[1rem]">
                                {cart ? (
                                    cart.cart_items.map((item, index) => (
                                        <div key={index} className="mx-auto w-full flex-none flex gap-[1rem] items-center lg:max-w-2xl min-w-[10rem] xl:max-w-4xl">
                                            <input
                                                id={`checkbox-${item.id}`}
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                                            />
                                            <div className="space-y-6 w-[100%]">
                                                <div className="rounded-lg border  p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
                                                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                                        <a href="#" className="shrink-0 md:order-1">
                                                            <img className="h-20 w-20 hidden" src={item.product.image_url} alt="imac image" />
                                                            <img className=" h-20 w-20 block" src={item.product.image_url} alt="imac image" />
                                                        </a>

                                                        <label htmlFor="counter-input" className="sr-only">Choose quantity:</label>
                                                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                                                            <div className="flex items-center">
                                                                <p>{item.quantity}</p>
                                                            </div>
                                                            <div className="text-end md:order-4 md:w-32">
                                                                <p className="text-base font-bold  text-white">Rp. {item.quantity * item.product.price}</p>
                                                            </div>
                                                        </div>

                                                        <div className="w-full min-w-0 flex-1  md:order-2 md:max-w-md">
                                                            <Link href={`/product/${item.product.slug}`} className="text-base font-medium  hover:underline text-white">{item.product.name}</Link>
                                                            <p className='mt-[.5rem]  text-orange-500 font-semibold'>Rp. {item.product.price}</p>
                                                            <p className='mt-[.5rem] mb-[1rem] text-white'>Stock: {item.product.stock}</p>
                                                            <div className="flex items-center gap-4">
                                                                <button onClick={() => handleDelete(item.id)} type="button" className="inline-flex text-red-500 items-center text-sm font-medium hover:underline ">
                                                                    <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                                    </svg>
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>There is no item</p>
                                )}
                            </div>

                            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                                <div className="space-y-4 rounded-lg border   p-4 shadow-sm border-gray-700 bg-gray-800 sm:p-6">
                                    <p className="text-xl font-semibold  text-white">Order summary</p>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <dl className="flex items-center justify-between gap-4">
                                                <dt className="text-base font-normal  text-gray-400">Original price</dt>
                                                <dd className="text-base font-medium  text-white">Rp. {total}</dd>
                                            </dl>
                                        </div>

                                        <dl className="flex items-center justify-between gap-4 border-t  pt-2 border-gray-700">
                                            <dt className="text-base font-bold  text-white">Total ({selectedItems.length} Product)</dt>
                                            <dd className="text-base font-bold  text-white">Rp. {total}</dd>
                                        </dl>
                                    </div>

                                    <div className="flex justify-center">
                                        <button onClick={handleClickCheckout} type="button" class=" focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900">Proceed to Checkout</button>
                                    </div>

                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-sm font-normal  text-gray-400"> or </span>
                                        <Link href="/product" title="" className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline text-white">
                                            Continue Shopping
                                            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                                <button onClick={handleDeleteAllItem} type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Clear All</button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            {/* <div className='my-[7rem] mx-[5rem] pb-[8rem]'>
                <h1 className='text-2xl font-bold mb-[2rem]'>Cart</h1>

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
                        <p className='text-xl font-semibold w-[30%] '>Product</p>
                        <div className=" flex w-[70%]">
                            <p className='text-xl font-semibold w-[25%] flex justify-center'>Price</p>
                            <p className='text-xl font-semibold w-[25%] flex justify-center'>Quantity</p>
                            <p className='text-xl font-semibold w-[25%] flex justify-center'>Total</p>
                            <p className='text-xl font-semibold w-[25%] flex justify-center'>Aksi</p>
                        </div>
                    </div>

                    {cart ? (
                        cart.cart_items.map((item, index) => (
                            <div key={index} className="p-[2rem] bg-gray-200 flex gap-[1rem] items-center">
                                <div className="flex items-center gap-[1.5rem] w-[100%]">

                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />

                                    <div className="w-[30%]">
                                        <div className="flex gap-[1rem]">
                                            <img width={100} src={item.product.image_url} />
                                            <div className="">
                                                <p className=''>{item.product.name}</p>
                                                <p className=''>Stock : {item.product.stock}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className=" flex w-[75%]">
                                        <p className='w-[25%] flex justify-center'>Rp. {item.product.price}</p>
                                        <p className='w-[25%] flex justify-center'>{item.quantity}</p>
                                        <p className='w-[25%] flex justify-center'>{item.quantity * item.product.price}</p>
                                        <div className='w-[25%] flex justify-center'>
                                            <button onClick={() => handleDelete(item.id)} type="button" className="px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 ">Delete</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>There is not a product</p>
                    )}

                </div>

            </div>
            <div className="w-[100%] fixed left-0 ring-0 bottom-0 p-[3rem] px-[5rem] bg-gray-400 flex justify-between">
                <button onClick={handleDeleteAllItem} type="button" className="px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 ">Clear All</button>

                <div className="flex gap-[1rem] items-center">
                    <p className='font-semibold text-lg'>
                        Total ({selectedItems.length} Product): Rp. {total}
                    </p>
                    <button onClick={handleClickCheckout} type="button" className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">Checkout</button>
                </div>

            </div> */}
        </>
    )
}

export async function getServerSideProps(context) {
    const client = buildClient(context.req);

    const { data } = await client.get("/api/v1/carts/");

    return {
        props: {
            cart: data.data,
        },
    };
}

export default Cart
