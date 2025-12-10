import { useAuth } from "@/context/AuthContext";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProfileUser({ image, name = 'FP' }: { image?: string, name?: string }) {
    const { signOut } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={ref}>
            <div className="flex items-center gap" onClick={() => setIsOpen(!isOpen)}>
                {image && <Image src={image} alt="Lumeo Logo" width={35} height={35} className="rounded-full" />}
                {name && <span className="rounded-full  bg-green-300 p-2 w-[35px] h-[35px] text-[14px] flex justify-center items-center tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">{name}</span>}
                {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </div>
            {isOpen && <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-100">Profile</li>
                    <li className="px-4 py-2 hover:bg-gray-100">Settings</li>
                    <li className="px-4 py-2 hover:bg-gray-100" onClick={signOut}>Logout</li>
                </ul>
            </div>}
        </div>
    )
}