import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountLayout({ children }) {

  const pathname = usePathname();

  return (
    <div className=" min-h-[100vh] flex flex-col gap-[2rem] p-[4rem] shadow-xl pt-[8rem]  bg-black">
      <div className="shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500">
        <div className="flex ">
          <Link href={"/account"}>
            <div className={` ${pathname == "/account" ? "bg-orange-500" : ""} p-[1rem] text-[15px] text-white hover:bg-gray-300`}>
              <h1>Profile</h1>
            </div>
          </Link>
          <Link href={"/account/my-order"}>
            <div className={` ${pathname.startsWith('/my-order') ? "bg-orange-500" : ""} p-[1rem] text-[15px] text-white hover:bg-gray-300`}>
              <h1>My Order</h1>
            </div>
          </Link>
        </div>
      </div>
      <div className="p-[2rem] shadow-[0_0_10px_0_rgba(0,0,0,0.9)] shadow-red-500">
        {children}
      </div>
    </div>
  );
}
