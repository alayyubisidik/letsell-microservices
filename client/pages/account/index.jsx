import AccountLayout from "@/components/AccountLayout";
import React, { useState, useRef, useEffect } from "react";
import buildClient from "../api/build-client";
import axios from "axios";

const Profile = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [username, setUsername] = useState("");
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setFullName(user.full_name);
            setEmail(user.email);
            setPhoneNumber(user.phone_number);
            setGender(user.gender);
            setDateOfBirth(user.date_of_birth.split("T")[0]);
            setProfilePicture(user.profile_picture);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePicture(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const enteredFile = fileInputRef.current.files[0];

        const formData = new FormData();
        formData.append("username", username);
        formData.append("full_name", fullname);
        formData.append("email", email);
        formData.append("phone_number", phoneNumber);
        formData.append("date_of_birth", new Date(dateOfBirth).toISOString());
        formData.append("gender", gender);

        console.log(gender)

        if (enteredFile) {
            formData.append("profile_picture", enteredFile);
        }

        try {
            await axios.put(`/api/v1/auth/${user.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            window.location.reload();
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
        <AccountLayout>
            <div className="border-b-2 border-blue-700">
                <h1 className="text-xl text-white font-semibold">My Profile</h1>
                <p className="text-sm mb-1 text-white">
                    Manage your profile information to control, protect and
                    secure your account.
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

            <form onSubmit={handleSubmit}>
                <div className=" flex flex-col-reverse justify-center items-center lg:justify-normal lg:flex lg:flex-row gap-[2rem] mt-[3rem]">
                    <div className="w-[100%] lg:w-[60%]">
                        <div className="mb-3">
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-white "
                            >
                                Username
                            </label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                id="username"
                                className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                            />

                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="full_name"
                                className="block mb-2 text-sm font-medium text-white "
                            >
                                Full Name
                            </label>
                            <input
                                value={fullname}
                                onChange={(e) => setFullName(e.target.value)}
                                type="text"
                                id="full_name"
                                className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-white "
                            >
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                id="email"
                                className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="phone_number"
                                className="block mb-2 text-sm font-medium text-white "
                            >
                                Phone Number
                            </label>
                            <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="number"
                                id="phone_number"
                                className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="date_of_birth"
                                className="block mb-2 text-sm font-medium text-white "
                            >
                                Date Of Birth
                            </label>
                            <input
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                type="date"
                                id="date_of_birth"
                                className=" bg-white border border-blue-700 text-black text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="gender"
                                className="block mb-2 text-sm font-medium text-white "
                            >
                                Gender
                            </label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                id="gender"
                                className="bg-gray-950 border border-blue-700 text-white text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                            >
                                <option value="laki-laki">Male</option>
                                <option value="perempuan">Female</option>
                            </select>
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-blue-700 focus:outline-none text-white  hover:shadow-red-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-3 "
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                    <div className="w-[40%] flex flex-col justify-center items-center lg:border-l-2 lg:border-blue-700">
                        <div className="h-[13rem] w-[13rem]">
                            <img
                                className="rounded-full w-[100%] h-[100%]"
                                src={profilePicture}
                                alt="Profile"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="shadow-[0_0_10px_0_rgba(0,0,0,0.9)] border-none shadow-blue-700 hover:shadow-red-500 py-2.5 px-5 mt-[1rem] mb-[.5rem] text-sm font-medium text-white focus:outline-none  rounded-lg border  focus:z-10 focus:ring-4 "
                        >
                            Change Image
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            name="profile_picture"
                            onChange={handleImageChange}
                        />
                        <div className="text-center">
                            <p className="text-sm text-white">
                                Image Size: max. 1 MB
                            </p>
                            <p className="text-sm text-white">
                                Image Format: .JPG, .JPEG, .PNG
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </AccountLayout>
        // <AccountLayout>
        //     <div className="border-b-2">
        //         <h1 className="text-xl font-semibold">My Profile</h1>
        //         <p className="text-sm mb-1">
        //             Manage your profile information to control, protect and
        //             secure your account.
        //         </p>
        //     </div>

        //     <form onSubmit={handleSubmit}>
        //         {errors.length > 0 && (
        //             <div
        //                 className="p-4 mb-4 text-sm text-red-700 rounded-lg bg-red-300"
        //                 role="alert"
        //             >
        //                 <ul>
        //                     {errors.map((error, index) => (
        //                         <li key={index}>{error.message}</li>
        //                     ))}
        //                 </ul>
        //             </div>
        //         )}
        //         <div className="flex gap-[2rem] mt-[1rem]">
        //             <div className="w-[60%]">
        //                 <div className="mb-3">
        //                     <label
        //                         htmlFor="username"
        //                         className="block mb-2 text-sm font-medium text-gray-900 "
        //                     >
        //                         Username
        //                     </label>
        //                     <input
        //                         value={username}
        //                         onChange={(e) => setUsername(e.target.value)}
        //                         type="text"
        //                         id="username"
        //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        //                     />
        //                 </div>
        //                 <div className="mb-3">
        //                     <label
        //                         htmlFor="full_name"
        //                         className="block mb-2 text-sm font-medium text-gray-900 "
        //                     >
        //                         Full Name
        //                     </label>
        //                     <input
        //                         value={fullname}
        //                         onChange={(e) => setFullName(e.target.value)}
        //                         type="text"
        //                         id="full_name"
        //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        //                     />
        //                 </div>
        //                 <div className="mb-3">
        //                     <label
        //                         htmlFor="email"
        //                         className="block mb-2 text-sm font-medium text-gray-900 "
        //                     >
        //                         Email
        //                     </label>
        //                     <input
        //                         value={email}
        //                         onChange={(e) => setEmail(e.target.value)}
        //                         type="email"
        //                         id="email"
        //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        //                     />
        //                 </div>
        //                 <div className="mb-3">
        //                     <label
        //                         htmlFor="phone_number"
        //                         className="block mb-2 text-sm font-medium text-gray-900 "
        //                     >
        //                         Phone Number
        //                     </label>
        //                     <input
        //                         value={phoneNumber}
        //                         onChange={(e) => setPhoneNumber(e.target.value)}
        //                         type="number"
        //                         id="phone_number"
        //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        //                     />
        //                 </div>
        //                 <div className="mb-3">
        //                     <label
        //                         htmlFor="date_of_birth"
        //                         className="block mb-2 text-sm font-medium text-gray-900 "
        //                     >
        //                         Date Of Birth
        //                     </label>
        //                     <input
        //                         value={dateOfBirth}
        //                         onChange={(e) => setDateOfBirth(e.target.value)}
        //                         type="date"
        //                         id="date_of_birth"
        //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        //                     />
        //                 </div>
        //                 <div className="mb-3">
        //                     <label
        //                         htmlFor="gender"
        //                         className="block mb-2 text-sm font-medium text-gray-900 "
        //                     >
        //                         Gender
        //                     </label>
        //                     <select
        //                         id="gender"
        //                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        //                         value={gender}
        //                         onChange={(e) => setGender(e.target.value)}
        //                     >
        //                         <option value="laki-laki">Male</option>
        //                         <option value="perempuan">Female</option>
        //                     </select>
        //                 </div>
        //                 <button
        //                     disabled={loading}
        //                     type="submit"
        //                     className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-3 "
        //                 >
        //                     {loading ? "Saving..." : "Save"}
        //                 </button>
        //             </div>
        //             <div className="w-[40%] flex flex-col items-center border-l-2">
        //                 <div className="h-[13rem] w-[13rem]">
        //                     <img
        //                         className="rounded-full w-[100%] h-[100%]"
        //                         src={profilePicture}
        //                         alt="Profile"
        //                     />
        //                 </div>
        //                 <button
        //                     type="button"
        //                     onClick={handleButtonClick}
        //                     className="py-2.5 px-5 mt-[1rem] mb-[.5rem] text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        //                 >
        //                     Change Image
        //                 </button>
        //                 <input
        //                     type="file"
        //                     ref={fileInputRef}
        //                     hidden
        //                     name="profile_picture"
        //                     onChange={handleImageChange}
        //                 />
        //                 <div className="text-center">
        //                     <p className="text-sm text-gray-500">
        //                         Image Size: max. 1 MB
        //                     </p>
        //                     <p className="text-sm text-gray-500">
        //                         Image Format: .JPG, .JPEG, .PNG
        //                     </p>
        //                 </div>
        //             </div>
        //         </div>
        //     </form>
        // </AccountLayout>
    );
};

export async function getServerSideProps(context) {
    const client = buildClient(context.req);

    const { data } = await client.get("/api/v1/auth/currentuser");

    return {
        props: {
            user: data.data,
        },
    };
}

export default Profile;
