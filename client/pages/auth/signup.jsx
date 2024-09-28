import React, { useRef, useState } from "react";
import Router from "next/router";
import Link from "next/link";
import axios from "axios";

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const usernameInputRef = useRef();
    const fullnameInputRef = useRef();
    const phoneNumberInputRef = useRef();
    const dateOfBirthInputRef = useRef();
    const genderInputRef = useRef();
    const fileInputRef = useRef();

    async function submitHandler(e) {
        e.preventDefault();

        setLoading(true);

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredUsername = usernameInputRef.current.value;
        const enteredFullname = fullnameInputRef.current.value;
        const enteredPhoneNumber = phoneNumberInputRef.current.value;
        const enteredDateOfBirth = new Date(dateOfBirthInputRef.current.value).toISOString();
        const enteredGender = genderInputRef.current.value;
        const enteredFile = fileInputRef.current.files[0];

        const formData = new FormData();
        formData.append("email", enteredEmail);
        formData.append("password", enteredPassword);
        formData.append("username", enteredUsername);
        formData.append("full_name", enteredFullname);
        formData.append("phone_number", enteredPhoneNumber);
        formData.append("date_of_birth", enteredDateOfBirth);
        formData.append("gender", enteredGender);

        if (enteredFile) {
            formData.append("profile_picture", enteredFile);
        }

        try {
            await axios.post("/api/v1/auth/signup", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Router.push("/");
        } catch (error) {
            setErrors(
                error.response.data.errors || [
                    { message: "Something went wrong!" },
                ]
            );
        }

        setLoading(false);
    }

    return (
        <section className="bg-black">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link href="/" className="flex items-center mb-6 text-2xl  text-red-500 italic font-bold">
                    Zen<span className='text-blue-700 '>Computer</span>
                </Link>

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

                <div className="w-full shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500 rounded-lg md:mt-0 sm:max-w-3xl xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                            Create your account
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={submitHandler}
                        >
                            <div className="flex gap-5">
                                <div className="w-[50%]">
                                    <div>
                                        <label
                                            htmlFor="username"
                                            className=" mt-2 block mb-1 text-sm font-medium text-white"
                                        >
                                            Username
                                        </label>
                                        <input
                                            ref={usernameInputRef}
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder="johndoe"
                                            className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className=" mt-2 block mb-1 text-sm font-medium text-white"
                                        >
                                            Password
                                        </label>
                                        <input
                                            ref={passwordInputRef}
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="••••••••"
                                            className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className=" mt-2 block mb-1 text-sm font-medium text-white"
                                        >
                                            Your email
                                        </label>
                                        <input
                                            ref={emailInputRef}
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="full_name"
                                            className=" mt-2 block mb-1 text-sm font-medium text-white"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            ref={fullnameInputRef}
                                            type="text"
                                            name="full_name"
                                            id="full_name"
                                            placeholder="Jhon Doe"
                                            className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="w-[50%]">
                                    <div>
                                        <label
                                            htmlFor="phone_number"
                                            className=" mt-2 block mb-1 text-sm font-medium text-white"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            ref={phoneNumberInputRef}
                                            type="number"
                                            name="phone_number"
                                            id="phone_number"
                                            placeholder="0898693432432"
                                            className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="date_of_birth"
                                            className=" mt-2 block mb-1 text-sm font-medium text-white"
                                        >
                                            Date Of Birth
                                        </label>
                                        <input
                                            ref={dateOfBirthInputRef}
                                            type="date"
                                            name="date_of_birth"
                                            id="date_of_birth"
                                            className="bg-white border border-blue-700 text-black text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="gender"
                                            className=" mt-2 block mb-1 text-sm font-medium text-white"
                                        >
                                            Gender
                                        </label>
                                        <select
                                            ref={genderInputRef}
                                            id="gender"
                                            name="gender"
                                            className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            required
                                        >
                                            <option value="laki-laki">
                                                Male
                                            </option>
                                            <option value="perempuan">
                                                Female
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1 mt-2 text-sm font-medium text-white "
                                            htmlFor="file_input"
                                        >
                                            Upload Profile Picture
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                                            id="file_input"
                                            type="file"
                                            name="profile_picture"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className={`w-full text-white ${loading ? "bg-blue-500" : "bg-blue-600"
                                    } hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                            >
                                {loading ? "Signing up..." : "Sign up"}
                            </button>
                            <p className="text-sm font-light text-white">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/signin"
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
