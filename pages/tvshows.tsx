/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

const baseimg = "https://image.tmdb.org/t/p/w500";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import router from "next/router";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // Fetch data from external API
    const movie = await fetch("https://api.themoviedb.org/3/trending/tv/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const type = "tv";
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()
    let isloggedin = false;
    if (session) {
        isloggedin = true;
    }
    // Pass data to the page via props
    return { props: { mediatype: type, movie: movie, isloggedin} }
}

export default function MoviesHome( { mediatype, movie, isloggedin } : any) {
    
    const [currentdata, setData] = useState(movie);
    const [query, setQuery] = useState("");

    const [currentinput, setInput] = useState("");
    const InputChange = (value: any) => {
        setInput(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/getSearchResult", {params: {searchterm: query, type: mediatype}});
            setData(getResult.data.result);
        }
        if (query != "") {
            fetchData();
        }
    }, [query]);

    const [parent] = useAutoAnimate<HTMLDivElement>();
    
    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    currentdata.results.forEach((movie: { name: string; popularity: number; poster_path: string; job: string; id: number, media_type: string}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        movie_arr.push([movie.name, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });
    
    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(18);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = movie_arr.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(movie_arr.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(movie_arr.length / castperpage)) {
            setCastPage(number);
        }
    };
    const display_movies = currentcast.map((movie) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <button onClick={() => router.push("/tv/" + movie[4])}>
                <img id={movie[4].toString()} src={movie[2].toString()} alt={movie[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </button>
        </div>
    );
    return (
        <>
            <Nav isloggedin={isloggedin} />
            <div className="grid p-6 sm:grid-cols-1 md:grid-cols-1 mt-6 max-w-6xl m-auto">
                <div className="mb-3 justify-center flex text-center m-auto">
                    <div className="input-group grid items-stretch w-full mb-4 grid-cols-6">
                        <input value={currentinput} onChange={(e) => InputChange(e.target.value)} type="search" className="col-span-5 form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search Tv Shows" aria-label="Search" aria-describedby="button-addon2" />
                        <button onClick={()=> setQuery(currentinput)} className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-xl font-semibold leading-7 text-white shadow-md hover:bg-blue-500 ease-in-out transition" type="button" id="button-addon2">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="col-span-2 sm:ml-0 md:ml-5 lg:ml-10" ref={parent}>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            {query != "" && (
                                <>
                                    <span className="text-3xl leading-8 font-bold pr-4">Tv Show Results - &quot;{query}&quot;: </span>
                                </>
                            )}
                            {query == "" && (
                                <span className="text-3xl leading-8 font-bold pr-4">Trending TV: </span>
                            )}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
                        {display_movies}
                    </div>
                </div>
            </div>
        </>
    )
}