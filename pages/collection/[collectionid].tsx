/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from 'next';
import router from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import Nav from "../../components/Nav";
import { getAvatarName } from '../../functions/getAvatarName';

const baseimg = "https://image.tmdb.org/t/p/w500";

export async function getServerSideProps(ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    // Fetch data from external API
    const collectionid = ctx.query.collectionid;
    const main = await fetch("https://api.themoviedb.org/3/collection/" + collectionid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    // Pass data to the page via props
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    let UserData = await getAvatarName(session);
    // @ts-ignore
    let username = UserData.username;
    // @ts-ignore
    let avatar = UserData.avatar;

    let isloggedin = false;
    if (session) {
        isloggedin = true;
    }
    return { props: { main, isloggedin, username, avatar } }
}

export default function DisplayCollection( { main, isloggedin, username, avatar } : any) {
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
            <button onClick={() => router.push("/movie/" + movie[4])}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-60 p-2" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </button>
        </div>
    );

    const display_names = partsarr.map((movie : any) =>
        <li key={movie[4]} className="group cursor-pointer">
            <button onClick={() => router.push("/movie/" + movie[4])}>
                {movie[0]}
            </button>
        </li>
    );

    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover h-screen">
                    <div className="grid grid-cols-6 mx-auto max-w-6xl pt-6 pb-32 sm:pt-16 sm:pb-40 items-stretch">
                        <img src={poster_img} alt={main.name.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
                        <div className="bg-white bg-opacity-75 shadow-md rounded-3xl md:rounded-r-3xl md:rounded-none col-span-6 md:col-span-4 pl-6 p-4">
                            <div className="p-2">
                                <h1 className="text-4xl text-black font-bold tracking-tight sm:text-6xl drop-shadow-sm">
                                    {main.name}
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-black">
                                    {main.overview}
                                </p>
                                <ul className="mt-6 text-lg leading-8 text-black list-disc pl-6">
                                    {display_names}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="text-3xl leading-8 font-bold pr-4 mt-6 max-w-6xl m-auto pl-2">Parts of collection: </div>
            <div className="max-w-6xl m-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                {display_parts}
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
