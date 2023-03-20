/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import { getAvatarName } from "../functions/getAvatarName";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const movie = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const baseimg = "https://image.tmdb.org/t/p/original"
    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    movie.results.forEach((movie: { title: string; backdrop_path: string}) => {
        var imgurl = "";
        if (movie.backdrop_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.backdrop_path;
        }
        movie_arr.push([movie.title, imgurl])
        counter++;
    });
    let rand1 = Math.floor(Math.random()*movie_arr.length);
    var movie_item1 = movie_arr[rand1];
    movie_arr.splice(rand1-1, rand1+1);
    let rand2 = Math.floor(Math.random()*movie_arr.length);
    var movie_item2 = movie_arr[rand2];
    movie_arr.splice(rand2-1, rand2+1);
    let rand3 = Math.floor(Math.random()*movie_arr.length);
    var movie_item3 = movie_arr[rand3];
    movie_arr.splice(rand3-1, rand3+1);
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    let UserData = await getAvatarName(session);
    // @ts-ignore
    let username = UserData.username;
    // @ts-ignore
    let avatar = UserData.avatar;

    if (!session) {
        return {
            props: {
                loggedin: false,
                movie_item1,
                movie_item2,
                movie_item3
            }
        }
    } else {
        return {
            props: {
                loggedin: true,
                movie_item1,
                movie_item2,
                movie_item3,
                username,
                avatar            
            }
        }
    }
}

export default function Home( { isloggedin, username, avatar, movie_item1, movie_item2, movie_item3 } : any) {
    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <section>
                <div className="bg-black text-white md:py-2 max-w-6xl m-auto">
                    <div className="container mx-auto flex flex-col md:flex-row items-center my-6 md:my-24">
                        <div className="flex flex-col w-full lg:w-1/3 justify-center items-start p-8">
                            <h1 className="text-5xl md:text-7xl py-2 tracking-loose font-bold"><span className="text-[hsl(226,45%,45%)]">Film</span>Front</h1>
                            <p className="text-sm md:text-lg text-gray-50 mb-4">Explore your favourite movies and
                                login now to watchlist your favouites, rate shows and share lists.</p>
                            <Link href="/trending"
                                className="bg-transparent hover:bg-[hsl(226,45%,45%)] text-[hsl(226,45%,45%)] hover:text-black rounded shadow hover:shadow-lg py-2 px-4 border border-[hsl(226,45%,45%)] hover:border-transparent">
                                View Trending
                            </Link>
                        </div>
                        <div className="p-8 mt-6 mb-6 md:mb-0 md:mt-0 ml-0 md:ml-12 lg:w-2/3  justify-center">
                            <div className="h-72 grid flex-wrap grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 content-center">
                                <img className="inline-block xl:block h-full w-auto rounded-xl" src={movie_item1[1]} alt="movie banner" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-32 text-gray-800 text-center max-w-6xl m-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-6 px-6">
                    <div className="mb-12 lg:mb-0 mx-auto">
                        <img
                        src="https://mdbootstrap.com/img/Photos/new-templates/landing-page/8.png"
                        className="img-fluid grayscale"
                        style={{maxWidth:"90px"}}
                        />
                    </div>

                    <div className="mb-12 lg:mb-0 mx-auto">
                        <img
                        src="https://mdbootstrap.com/img/Photos/new-templates/landing-page/2.png"
                        className="img-fluid grayscale"
                        style={{maxWidth:"90px"}}
                        />
                    </div>

                    <div className="mb-12 lg:mb-0 mx-auto">
                        <img
                        src="https://mdbootstrap.com/img/Photos/new-templates/landing-page/7.png"
                        className="img-fluid grayscale"
                        style={{maxWidth:"90px"}}
                        />
                    </div>

                    <div className="mb-12 lg:mb-0 mx-auto">
                        <img
                        src="https://mdbootstrap.com/img/Photos/new-templates/landing-page/1.png"
                        className="img-fluid grayscale"
                        style={{maxWidth:"90px"}}
                        />
                    </div>

                    <div className="mb-12 lg:mb-0 mx-auto">
                        <img
                        src="https://mdbootstrap.com/img/Photos/new-templates/landing-page/4.png"
                        className="img-fluid grayscale"
                        style={{maxWidth:"90px"}}
                        />
                    </div>

                    <div className="mb-12 lg:mb-0 mx-auto">
                        <img
                        src="https://mdbootstrap.com/img/Photos/new-templates/landing-page/5.png"
                        className="img-fluid grayscale"
                        style={{maxWidth:"90px"}}
                        alt="Sony - logo"
                        />
                    </div>
                </div>
            </section>
            <section className="text-white text-center md:text-left max-w-6xl m-auto mb-6" >
                <div className="block rounded-lg shadow-lg"> 
                <div className="flex flex-wrap items-center">
                    <div className="grow-0 shrink-0 basis-auto w-full lg:w-12/12 xl:w-12/12">
                        <div className="px-6 py-12 md:px-12">
                            <div className="flex">
                                <h2 className="text-3xl font-bold mb-6 pb-2">Top quality product</h2>
                                <button type="button"
                                    className="inline-block px-7 py-3 mx-6 mb-6 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">
                                    Sign in
                                </button>
                            </div>
                            <p className="text-gray-500 mb-6 pb-2">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A soluta corporis
                            voluptate ab error quam dolores doloremque, quae consectetur.
                            </p>
                            <div className="flex flex-wrap mb-6">
                            <div className="w-full lg:w-6/12 xl:w-4/12 mb-4">
                                <p className="flex items-center justify-center md:justify-start">
                                <svg className="w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">
                                    </path>
                                </svg>Noise cancelling
                                </p>
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-4/12 mb-4">
                                <p className="flex items-center justify-center md:justify-start">
                                <svg className="w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">
                                    </path>
                                </svg>Touch controls
                                </p>
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-4/12 mb-4">
                                <p className="flex items-center justify-center md:justify-start">
                                <svg className="w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">
                                    </path>
                                </svg>Clear calls
                                </p>
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-4/12 mb-4">
                                <p className="flex items-center justify-center md:justify-start">
                                <svg className="w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">
                                    </path>
                                </svg>Quite mode
                                </p>
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-4/12 mb-4">
                                <p className="flex items-center justify-center md:justify-start">
                                <svg className="w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">
                                    </path>
                                </svg>Secure
                                </p>
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-4/12 mb-4">
                                <p className="flex items-center justify-center md:justify-start">
                                <svg className="w-4 h-4 mr-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">
                                    </path>
                                </svg>Comfortable
                                </p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </section>
            <section className="text-gray-800 max-w-6xl m-auto pb-40">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="mt-6 mb-6 md:mb-0 md:mt-0 ml-0 md:ml-12 justify-center col-span-2">
                        <div className="h-72 grid flex-wrap grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 content-center">
                            <img className="inline-block xl:block h-full w-auto rounded-xl" src={movie_item3[1]} alt="movie banner" />
                        </div>
                    </div>
                    <div className="pb-10 text-left pl-10 p-2">
                        <h2 className="text-5xl font-bold tracking-tight leading-tight pb-4 text-blue-600">
                            Follow Us
                        </h2>
                        <div className="grid grid-cols-1 flex-wrap justify-center max-w-xs">
                            <button type="button" data-mdb-ripple="true" data-mdb-ripple-color="light"
                            className="inline-block py-2.5 px-6 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                            style={{backgroundColor: "#1877f2"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4 mr-2">
                                <path fill="currentColor"
                                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                            </svg>
                            Facebook
                            </button>

                            <button type="button" data-mdb-ripple="true" data-mdb-ripple-color="light"
                            className="inline-block py-2.5 px-6 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                            style={{backgroundColor: "#1da1f2"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 mr-2">
                                <path fill="currentColor"
                                d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                            </svg>
                            Twitter
                            </button>

                            <button type="button" data-mdb-ripple="true" data-mdb-ripple-color="light"
                            className="inline-block py-2.5 px-6 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                            style={{backgroundColor: "#ea4335"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-4 h-4 mr-2">
                                <path fill="currentColor"
                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                            </svg>
                            Google
                            </button>

                            <button type="button" data-mdb-ripple="true" data-mdb-ripple-color="light"
                            className="inline-block py-2.5 px-6 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                            style={{backgroundColor: "#c13584"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 mr-2">
                                <path fill="currentColor"
                                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                            </svg>
                            Instagram
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}