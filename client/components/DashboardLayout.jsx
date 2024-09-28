import Link from "next/link";

export default function DashboardLayout({ children }) {
    return (
        <div className=" min-h-[100vh] flex gap-[3rem] p-[3rem] shadow-xl m-[5rem]">
          <div className="w-[10%] shadow-xl p-[2rem]">
            <div className="flex flex-col">
              <Link href={"/dashboard"}>
                <div className="p-[1rem] hover:bg-gray-300">
                  <h1>Dashboard</h1>
                </div>
              </Link>
              <Link href={"/dashboard/user"}>
                <div className="p-[1rem] hover:bg-gray-300">
                  <h1>User</h1>
                </div>
              </Link>
              <Link href={"/dashboard/category"}>
                <div className="p-[1rem] hover:bg-gray-300">
                  <h1>Category</h1>
                </div>
              </Link>
              <Link href={"/dashboard/product"}>
                <div className="p-[1rem] hover:bg-gray-300">
                  <h1>Product</h1>
                </div>
              </Link>
            </div>
          </div>
          <div className="w-[90%] shadow-xl p-[2rem]">
            {children}
          </div>
        </div>
    );
}
