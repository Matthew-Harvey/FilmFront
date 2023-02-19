/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Nav({isloggedin} : any) {
    const [show, setShow] = useState(false);
    const supabase = useSupabaseClient();
    const router = useRouter();
    async function SignOut(){
        await supabase.auth.signOut();
        router.replace(router.asPath);
    }
    async function SignIn(){
        router.push('/login');
    }
    return (
        <>
            <div className="w-full bg-gray-100 z-50 sticky top-0">
            <div className="navbar max-w-6xl m-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                                <button onClick={() => router.push("/trending")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Trending</button>
                            </li>
                            <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-center">
                                <button onClick={() => router.push("/movies")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Movies</button>
                            </li>
                            <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                                <button onClick={() => router.push("/tvshows")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">TV Shows</button>
                            </li>
                            <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                                <button onClick={() => router.push("/people")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">People</button>
                            </li>
                            <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                                <button onClick={() => router.push("/list")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Lists</button>
                            </li>
                            <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                                <button onClick={() => router.push("/trivia")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Trivia</button>
                        </li>
                        </ul>
                    </div>
                    <a href="/">
                        <div className="flex items-center" aria-label="Home" role="img">
                            <img className="cursor-pointer w-9 h-9 sm:w-auto" src="/movie.png" alt="logo" />
                            <p className="ml-2 lg:ml-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-700">MyMovies</p>
                        </div>
                    </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                            <button onClick={() => router.push("/trending")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Trending</button>
                        </li>
                        <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-center">
                            <button onClick={() => router.push("/movies")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Movies</button>
                        </li>
                        <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                            <button onClick={() => router.push("/tvshows")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">TV Shows</button>
                        </li>
                        <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                            <button onClick={() => router.push("/people")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">People</button>
                        </li>
                        <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                            <button onClick={() => router.push("/list")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Lists</button>
                        </li>
                        <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-1 lg:ml-4 pt-10 md:pt-0 m-auto text-center">
                            <button onClick={() => router.push("/trivia")} className="m-auto text-center btn hover:text-blue-400 btn-link text-lg font-normal no-underline normal-case">Trivia</button>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    {!isloggedin ? (
                        <button onClick={()=> SignIn()} 
                            className="inline-block rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-green-500 hover:text-white hover:scale-110 ease-in-out transition">
                            Sign In
                        </button>
                        ) :
                        <button onClick={()=> SignOut()} 
                            className="inline-block rounded-lg bg-red-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-red-500 hover:text-white hover:scale-110 ease-in-out transition">
                            Sign Out
                        </button>
                    }
                </div>
            </div>
            </div>
        </>
    );
}
