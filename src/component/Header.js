import React from 'react'
import { FaBars } from "react-icons/fa"
import { FaCircleUser } from "react-icons/fa6";
import Logo from "../assets/images/logo.png"
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="py-4 px-6 bg-blue-700 flex items-center justify-between text-white">
            <div className="flex items-center">
                <FaBars className="text-white mr-3" size={20} />
                <Link to="/"><img src={Logo} alt="" className="w-8" /></Link>
            </div>
            <div className="mx-2">
                <div className="searchBar">
                    <input id="searchQueryInput" type="text" name="searchQueryInput" placeholder="Search" defaultValue="" />
                    <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
                        <svg className="h-[24px] w-[24px]" viewBox="0 0 24 24"><path fill="#fff" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                <FaCircleUser size={30} className="text-white" />
            </div>
        </div>
    )
}

export default Header