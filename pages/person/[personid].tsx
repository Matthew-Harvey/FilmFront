/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import router from "next/router";
import { useState } from "react";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // Fetch data from external API
    const personid = ctx.query.personid;
    const main = await fetch("https://api.themoviedb.org/3/person/" + personid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const credits = await fetch("https://api.themoviedb.org/3/person/" + personid + "/combined_credits?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    
    const supabase = createServerSupabaseClient(ctx);
    const {
        data: { session },
    } = await supabase.auth.getSession()

    let isloggedin = false;
    if (session) {
        isloggedin = true;
    }
    // Pass data to the page via props
    return { props: { main, credits, isloggedin } }
}

export default function DisplayPerson( { main, credits, isloggedin } : any) {
    const baseimg = "https://image.tmdb.org/t/p/w500";
    const poster_img = baseimg + main.profile_path;
    const imdblink = "https://www.imdb.com/name/" + main.imdb_id;
    const tag = main.birthday + " / " + main.place_of_birth;
    const [parent] = useAutoAnimate<HTMLDivElement>();

    const castarr: (string | number)[][] = [];
    var counter = 0;
    credits.cast.forEach((movie: { name: string; character: string; title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        if (movie.title == undefined) {
            castarr.push([movie.name, movie.popularity, imgurl, movie.character, movie.id, counter, "/tv/" + movie.id])
        } else {
            castarr.push([movie.title, movie.popularity, imgurl, movie.character, movie.id, counter, "/movie/" + movie.id])
        }
        counter++;
    });
    castarr.sort(compareSecondColumn);

    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(6);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = castarr.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(castarr.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(castarr.length / castperpage)) {
            setCastPage(number);
        }
    };
    const display_cast = currentcast.map((movie: any) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <button onClick={() => router.push(movie[6])}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </button>
        </div>
    );

    const crewarr: (string | number)[][] = [];
    var counter = 0;
    credits.crew.forEach((movie: { name: string; character: string; title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        if (movie.title == undefined) {
            crewarr.push([movie.name, movie.popularity, imgurl, movie.character, movie.id, counter, "/tv/" + movie.id])
        } else {
            crewarr.push([movie.title, movie.popularity, imgurl, movie.character, movie.id, counter, "/movie/" + movie.id])
        }
        counter++;
    });
    crewarr.sort(compareSecondColumn);

    const [crewpage, setCrewPage] = useState(1);
    const [crewperpage] = useState(6);
    const indexofcrewlast = crewpage * crewperpage;
    const indexofcrewfirst = indexofcrewlast - crewperpage;
    const currentcrew = crewarr.slice(indexofcrewfirst, indexofcrewlast)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(crewarr.length / crewperpage); i++) {
        crewPageNumbers.push(i);
    }
    const crewpaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(crewarr.length / crewperpage)) {
            setCrewPage(number);
        }
    };
    const display_crew = currentcrew.map((movie: any) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <button onClick={() => router.push(movie[6])}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </button>
        </div>
    );

    let sentence_spit = main.biography.split('.');
    let short_overview = "";
    for (var se in sentence_spit ) {
        if (short_overview.length < 400) {
            short_overview = sentence_spit[se] + ". " + short_overview
        }
    }

    return (
        <>
            <Nav isloggedin={isloggedin} />
            <main>
                <div className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover bg-gradient-to-br from-blue-400 to-red-500 h-screen">
                    <div className="grid grid-cols-6 mx-auto pt-6 pb-32 sm:pt-16 sm:pb-40 items-stretch max-w-6xl m-auto">
                        <img src={poster_img} alt={main.name.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
                        <div className="bg-white bg-opacity-75 shadow-md rounded-3xl md:rounded-r-3xl md:rounded-none col-span-6 md:col-span-4 pl-6 p-4">
                            <div className="hidden sm:flex p-2 py-6">
                                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-xl leading-6 ring-1 ring-gray-900/50 hover:ring-gray-900/5">
                                    <span className="text-gray-600">
                                        {tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-2">
                                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl drop-shadow-sm text-black">
                                    {main.name}
                                </h1>
                                <div className="text-2xl leading-8 font-normal mt-6 text-black">
                                    Known for {main.known_for_department}
                                </div>
                                <div className="text-lg leading-8 font-normal mt-6 text-black">
                                    {short_overview}
                                </div>
                                <input type="checkbox" id="my-modal" className="modal-toggle" />
                                <div className="modal">
                                    <div className="modal-box m-auto max-w-2xl">
                                        <div className="text-lg leading-8 font-normal mt-6 text-black">
                                            {main.biography}
                                        </div>
                                        <div className="modal-action">
                                            <label htmlFor="my-modal" className="inline-block rounded-lg bg-slate-600 px-4 py-1.5 text-lg font-semibold leading-7 text-white shadow-md hover:bg-slate-500 hover:text-white hover:scale-110 ease-in-out transition">Close</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-x-4">
                                    <a
                                        href={imdblink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition"
                                    >
                                        IMDb
                                    </a>
                                    {main.biography.length > 400 &&
                                        <label
                                            htmlFor="my-modal"
                                            className="inline-block rounded-lg bg-slate-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-slate-500 hover:text-white hover:scale-110 ease-in-out transition"
                                        >
                                            Full Biography
                                        </label>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="grid sm:grid-cols-1 md:grid-cols-1 max-w-6xl m-auto mt-6">
                <div className="" ref={parent}>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">In Cast: </span>
                            <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {castpage + " / " + Math.ceil(castarr.length / castperpage)} </span>
                            <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    {display_cast}
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">In Crew: </span>
                            <button onClick={() => crewpaginate(crewpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {crewpage + " / " + Math.ceil(crewarr.length / crewperpage)} </span>
                            <button onClick={() => crewpaginate(crewpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    {display_crew}
                </div>
            </div>
        </>
    );
}


function compareSecondColumn(a: any, b: any) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (b[1] < a[1]) ? -1 : 1;
    }
}