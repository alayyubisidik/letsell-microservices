import DashboardLayout from "@/components/DashboardLayout";
import React, { useState } from "react";
import buildClient from "../api/build-client";
import axios from "axios";

const UserDashboard = ({ users }) => {
    const [errors, setErrors] = useState([]);

    const handleChangeStatus = async (userId) => {
        try {
            await axios.put(`/api/v1/auth/user/change-status/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
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
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    return (
        <DashboardLayout>
            <div>
                <h1 className="text-xl font-bold mb-[1rem]">User Manajement</h1>

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
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Profile Picture
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Full Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Phone Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date Of Birth
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Gender
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created At
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users ? (
                                users.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="bg-white border-b "
                                    >
                                        <td className="px-6 py-4">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <img src={user.profile_picture} width={200} alt="" />
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.full_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.phone_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(user.date_of_birth)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.gender}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleChangeStatus(user.id)}
                                                className={`px-4 py-2 text-white font-semibold rounded-md ${user.status ? "bg-green-500" : "bg-red-500"
                                                    }`}
                                            >
                                                {user.status ? "Active" : "Blocked"}
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export async function getServerSideProps(context) {
    const client = buildClient(context.req);

    const { data } = await client.get("/api/v1/auth/user");

    return {
        props: {
            users: data.data,
        },
    };
}

export default UserDashboard;
