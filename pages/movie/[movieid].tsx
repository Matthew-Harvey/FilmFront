/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from '@formkit/auto-animate/react';
import Topcast from "../../components/Topcast";
import Topcrew from "../../components/Topcrew";
import Recommended from "../../components/Recommend";
import { Videos } from "../../components/Videos";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Nav from '../../components/Nav';
import router from 'next/router';
import { getAvatarName } from '../../functions/getAvatarName';
import { useSession } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { Collection } from '../../components/Collection';
import { Hero } from '../../components/Hero';

const baseimg = "https://image.tmdb.org/t/p/w500";

export const getServerSideProps = async (ctx: any) => {
    const supabase = createServerSupabaseClient(ctx);
    const {
        data: { session },
    } = await supabase.auth.getSession()
    
    let UserData = await getAvatarName(session);
    // @ts-ignore
    let username = UserData.username;
    // @ts-ignore
    let avatar = UserData.avatar;

    let isloggedin = false;
    if (session) {
        isloggedin = true;
    }

    let langquery = await supabase.from('store_api').select().eq("created_at", new Date().toDateString());
    let already_exists = false;
    let response = "";
    // @ts-ignore
    try {already_exists = langquery.data[0].created_at == new Date().toDateString(); response = langquery.data[0];} catch {already_exists = false;}
    if (already_exists == false) {
        response = await fetch('https://api.themoviedb.org/3/configuration/languages' + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        await supabase.from('store_api').insert({ id: new Date().getTime(), created_at: new Date().toDateString(), content: response})
    }
    // Fetch data from external API
    const movieid = ctx.query.movieid;
    const main = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const credits = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/credits?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const recommend = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/recommendations?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const videos = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/videos?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());

    // @ts-ignore
    let is_watchlist = await supabase.from('watchlist').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "movie");
    let watchlist_bool = false;
    // @ts-ignore
    if (is_watchlist.data?.length > 0) {
        watchlist_bool = true;
    }

    // @ts-ignore
    let is_rating = await supabase.from('rating').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "movie");
    let rating_bool = false;
    // @ts-ignore
    if (is_rating.data?.length > 0) {rating_bool = is_rating.data[0];};

    // Pass data to the page via props
    return { props: { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool, rating_bool} }
}

export default function DisplayMovie( { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool, rating_bool} : any) {
    const [parent] = useAutoAnimate<HTMLDivElement>();
    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <Hero main={main} response={response} watchlist_bool={watchlist_bool} rating_bool={rating_bool} type={"movie"} />
            <p className="mt-6 text-lg leading-8 text-white flex md:hidden max-w-xl m-auto p-6">
                {main.overview}
            </p>
            <div className="grid p-2 grid-cols-1 max-w-6xl m-auto pb-40">
                <div className="" ref={parent}>
                    <Topcast castcredit={credits.cast} />
                    <Topcrew crewcredit={credits.crew} />
                    <Videos videos={videos} />
                    <Recommended recommend={recommend} type="movie" />
                    <Collection collection={main.belongs_to_collection}  />
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}