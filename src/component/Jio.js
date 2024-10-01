import React, { useState } from 'react'
import Footer from "../assets/images/footer.png"
import { RiSmartphoneFill } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import B1 from "../assets/images/rupee.svg"
import { useNavigate } from 'react-router-dom';
import { TbMobiledata } from 'react-icons/tb';
import { IoMdCloseCircle } from 'react-icons/io';

const Jio = () => {
    const navigate = useNavigate()
    const [number, setnumber] = useState()
    const [error, setError] = useState(false)
    const [toggle, setToggle] = useState(true)
    const openOffer = () => {
        if (number?.length === 10) {
            localStorage.setItem("number", number)
            navigate("/recharge", { state: { "toggle": toggle } })
        } else {
            setError(true)
        }
    }

    return (
        <div className="bg-white">
            <div className="w-[48px] h-[48px] rounded-full bg-[#e7ebf8] flex items-center justify-center mt-12 mx-auto">
                <img src={B1} alt="" className="w-3/4" />
            </div>
            <h1 className="text-slate-900 text-center text-[24px] mt-2 font-bold">{toggle ? "Mobile Recharge" : "Data Voucher"}</h1>
            <p className="text-[14px] text-center mt-1">
                {toggle ? "Enter your details to find the best prepaid plans." : "Get 1GB data voucher at just ₹1."}
            </p>
            <p className="text-[14px] text-center font-semibold text-slate-700">Starting at Just {toggle ? "₹149" : "129"}</p>
            <div className="bg-gray-100 rounded-full flex items-center justify-between w-fit p-1 mx-auto mt-6">
                <div className={`${toggle ? "bg-[#0f3cc9] text-white" : "text-gray-500"} flex items-center text-[1rem] font-bold w-fit py-2 px-4 rounded-full`} onClick={() => setToggle(true)}><RiSmartphoneFill size={16} /><span className="ml-2">Mobile</span></div>
                <div className={`${!toggle ? "bg-[#0f3cc9] text-white" : "text-gray-500"} flex items-center text-[1rem] font-bold w-fit py-2 px-4 rounded-full`} onClick={() => setToggle(false)}><TbMobiledata size={16} /><span className="ml-2">Data</span></div>
            </div>
            <div className="relative mx-6 mt-8">
                <input
                    type="number"
                    onChange={(e) => setnumber(e.target.value)}
                    value={number || ""}
                    id="floating-phone-number"
                    className="block py-2.5 ps-6 pe-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                <label for="floating-phone-number" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-placeholder-shown:start-6 peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Mobile number</label>
            </div>
            {error && <p className="text-red-700 my-1 px-6 text-[10px] flex items-center "><IoMdCloseCircle size={24} className="mr-2" />The number you have entered is not a Correct number. Please enter a Correct number and try again.</p>}
            <div className="mt-8 px-6">
                <button onClick={openOffer} className="bg-[#0f3cc9] py-2 w-full text-[16px] rounded-full font-bold text-white">Continue</button>
            </div>
            <img src={Footer} alt="" className="w-full" />
        </div>
    )
}

export default Jio