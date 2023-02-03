/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react';

const baseimg = "https://image.tmdb.org/t/p/w500";

export async function getServerSideProps({ query } : any) {
    // Fetch data from external API
    const collectionid = query.collectionid;
    const main = await fetch("https://api.themoviedb.org/3/collection/" + collectionid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    // Pass data to the page via props
    return { props: { main } }
}

export default function DisplayMovie( { main } : any) {
    const backdrop_img = "url(https://image.tmdb.org/t/p/original" + main.backdrop_path + ")";
    const poster_img = baseimg + main.poster_path;
    const [parent] = useAutoAnimate<HTMLDivElement>();

    const partsarr: (string | number)[][] = [];
    var counter = 0;
    main.parts.forEach((movie: { title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        partsarr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });
    partsarr.sort(compareSecondColumn);

    const display_parts = partsarr.map((movie : any) =>
        <div key={movie[4]} className="group cursor-pointer relative inline-block text-center">
            <a href={"/movie/" + movie[4]}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-80 p-2" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </a>
        </div>
    );
    return (
        <>
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover">
                <div className="grid grid-cols-6 mx-auto max-w-4xl pt-20 pb-32 sm:pt-48 sm:pb-40 items-stretch">
                        <img src={poster_img} alt={main.name.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
                        <div className="bg-white bg-opacity-75 shadow-md rounded-3xl md:rounded-r-3xl md:rounded-none col-span-6 md:col-span-4">
                            <div className="p-2">
                                <h1 className="text-4xl text-black font-bold tracking-tight sm:text-center sm:text-6xl drop-shadow-sm">
                                    {main.name}
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                                    {main.overview}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="grid p-2 sm:grid-cols-1 md:grid-cols-3">
                <div className="text-3xl leading-8 font-bold p-4">
                    Parts of collection:
                </div>
                <div className="col-span-3 sm:ml-0 md:ml-5 lg:ml-10" ref={parent}>
                    {display_parts}
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
