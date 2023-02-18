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
            <div className="bg-gray-100 overflow-y-hidden fixed top-0 z-50 w-full shadow-lg">
                <nav className="w-full navbar">
                    <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                        <div className="flex-1">
                            <a href="/">
                                <div className="flex items-center" aria-label="Home" role="img">
                                    <img className="cursor-pointer w-9 h-9 sm:w-auto" src="/movie.png" alt="logo" />
                                    <p className="ml-2 lg:ml-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-700">MyMovies</p>
                                </div>
                            </a>
                        </div>
                        <div>
                            <button onClick={() => setShow(!show)} className="sm:block md:hidden lg:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                <img className="h-8 w-8" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg4.svg" alt="show" />
                            </button>
                            <div id="menu" className={`md:block lg:block ${show ? '' : 'hidden'} flex-none`}>
                                <button onClick={() => setShow(!show)} className="block md:hidden lg:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 fixed focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white md:bg-transparent z-30 top-0 mt-3">
                                    <img className="h-8 w-8" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg5.svg" alt="hide" />
                                </button>
                                <ul className="m-auto flex text-4xl md:text-base py-4 md:flex flex-col md:flex-row justify-center fixed md:relative top-0 bottom-0 left-0 right-0 bg-white md:bg-transparent z-20">
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-5 md:ml-10 pt-10 md:pt-0 m-auto text-center">
                                        <a href="/trending" className="m-auto text-center">Trending</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-5 lg:ml-10 pt-10 md:pt-0 m-auto text-center">
                                        <a href="/movies" className="m-auto text-center">Movies</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-5 lg:ml-10 pt-10 md:pt-0 m-auto text-center">
                                        <a href="/tvshows" className="m-auto text-center">TV Shows</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-5 lg:ml-10 pt-10 md:pt-0 m-auto text-center">
                                        <a href="/people" className="m-auto text-center">People</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-5 lg:ml-10 pt-10 md:pt-0 m-auto text-center">
                                        <a href="/list" className="m-auto text-center">Lists</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer sm:ml-5 lg:ml-10 pt-10 md:pt-0 m-auto text-center">
                                        <a href="/trivia" className="m-auto text-center">Trivia</a>
                                    </li>
                                    <li className="text-gray-600 text-lg sm:ml-5 lg:ml-10 pt-10 md:pt-0 m-auto text-center">
                                        {isloggedin == false && 
                                            <button onClick={()=> SignIn()} 
                                                className="inline-block rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-green-500 hover:text-white hover:scale-110 ease-in-out transition">
                                                    Sign In
                                            </button>
                                        }
                                        {isloggedin == true &&
                                            <>
                                                <button onClick={()=> SignOut()} 
                                                    className="inline-block rounded-lg bg-red-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-red-500 hover:text-white hover:scale-110 ease-in-out transition">
                                                        Sign Out
                                                </button>
                                            </>
                                        }
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
