/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Nav from "../components/Nav";

const baseimg = "https://image.tmdb.org/t/p/w500";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // Fetch data from external API
    const movie = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const tv = await fetch("https://api.themoviedb.org/3/trending/tv/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const people = await fetch("https://api.themoviedb.org/3/trending/person/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    // Pass data to the page via props
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()
    let isloggedin = false;
    if (session) {
        isloggedin = true;
    }
    return { props: { movie, tv, people, isloggedin} }
}

export default function Trending( { movie, tv, people, isloggedin } : any) {
    const [movie_animate] = useAutoAnimate<HTMLDivElement>();
    const [tv_animate] = useAutoAnimate<HTMLDivElement>();
    const [people_animate] = useAutoAnimate<HTMLDivElement>();

    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    movie.results.forEach((movie: { title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        movie_arr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });
    
    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(6);
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
            <a href={"/movie/" + movie[4]}>
                <img id={movie[4].toString()} src={movie[2].toString()} alt={movie[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </a>
        </div>
    );

    const crewarr: (string | number)[][] = [];
    var counter = 0;
    tv.results.forEach((movie: { name: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        crewarr.push([movie.name, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });
    crewarr.sort(compareSecondColumn);

    const [crewpage, setCrewPage] = useState(1);
    const [crewperpage] = useState(6);
    const indexoflastcrew = crewpage * crewperpage;
    const indexoffirstcrew = indexoflastcrew - crewperpage;
    const currentcrew = crewarr.slice(indexoffirstcrew, indexoflastcrew)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(crewarr.length / crewperpage); i++) {
        crewPageNumbers.push(i);
    }
    const crewpaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(crewarr.length / crewperpage)) {
            setCrewPage(number);
        }
    };
    const display_crew = currentcrew.map((person) =>
        <div key={person[5]} className="group cursor-pointer relative inline-block text-center">
            <a href={"/tv/" + person[4]}>
                <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {person[0]}
                    </span>
                </div>
            </a>
        </div>
    );

    const personarr: (string | number)[][] = [];
    var counter = 0;
    people.results.forEach((person: { original_name: string; popularity: number; profile_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (person.profile_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + person.original_name;
        } else {
            imgurl = baseimg + person.profile_path;
        }
        personarr.push([person.original_name, person.popularity, imgurl, person.job, person.id, counter])
        counter++;
    });
    personarr.sort(compareSecondColumn);

    const [personpage, setPeoplePage] = useState(1);
    const [peopleperpage] = useState(6);
    const indexoflastperson = personpage * peopleperpage;
    const indexoffirstperson = indexoflastperson - peopleperpage;
    const currentpeople = personarr.slice(indexoffirstperson, indexoflastperson)
    const peoplePageNumbers = [];
    for (let i = 1; i <= Math.ceil(personarr.length / peopleperpage); i++) {
        peoplePageNumbers.push(i);
    }
    const peoplePaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(personarr.length / peopleperpage)) {
            setPeoplePage(number);
        }
    };
    const display_people = currentpeople.map((person) =>
        <div key={person[5]} className="group cursor-pointer relative inline-block text-center pb-10">
            <a href={"/person/" + person[4]}>
                <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {person[0]}
                    </span>
                </div>
            </a>
        </div>
    );
    return (
        <>
            <Nav isloggedin={isloggedin} />
            <div className="grid p-6 sm:grid-cols-1 md:grid-cols-1 mt-28 max-w-6xl m-auto">
                <div className="col-span-2 sm:ml-0 md:ml-5 lg:ml-10">
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">Trending Movies: </span>
                            <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {castpage + " / " + Math.ceil(movie_arr.length / castperpage)} </span>
                            <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6" ref={movie_animate}>
                        {display_movies}
                    </div>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">Trending TV Shows: </span>
                            <button onClick={() => crewpaginate(crewpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {crewpage + " / " + Math.ceil(crewarr.length / crewperpage)} </span>
                            <button onClick={() => crewpaginate(crewpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6" ref={tv_animate}>
                        {display_crew}
                    </div>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">Trending People: </span>
                            <button onClick={() => peoplePaginate(personpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {personpage + " / " + Math.ceil(personarr.length / peopleperpage)} </span>
                            <button onClick={() => peoplePaginate(personpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6" ref={people_animate}>
                        {display_people}
                    </div>
                </div>
            </div>
        </>
    )
}

function compareSecondColumn(a: any, b: any) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (b[1] < a[1]) ? -1 : 1;
    }
}