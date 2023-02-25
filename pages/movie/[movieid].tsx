/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from '@formkit/auto-animate/react';
import Topcast from "../../components/Topcast";
import Topcrew from "../../components/Topcrew";
import Recommended from "../../components/Recommend";
import { Videos } from "../../components/Videos";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Nav from '../../components/Nav';
import router, { SingletonRouter } from 'next/router';
import { getAvatarName } from '../../functions/getAvatarName';
import { useSession } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    // Pass data to the page via props
    return { props: { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool} }
}

export default function DisplayMovie( { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool} : any) {
    const backdrop_img = "url(https://image.tmdb.org/t/p/original" + main.backdrop_path + ")";
    const poster_img = baseimg + main.poster_path;
    const imdblink = "https://www.imdb.com/title/" + main.imdb_id;
    const revtotal = "£" + new Intl.NumberFormat('en-GB').format(main.revenue);
    const tag = main.status + " " + new Date(main.release_date).toLocaleDateString("en-GB") + " / " + main.runtime + " minutes / " +  revtotal;
    const [parent] = useAutoAnimate<HTMLDivElement>();

    let lang = "";
    for (let x in response.content) {
        if (response.content[x].iso_639_1 == main.original_language) {
            lang = response.content[x].english_name;
        }
    }

    const session = useSession();

    const AddWatchlistToast = () => toast.success('Added to watchlist', {position: "bottom-right",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "dark",});
    async function AddWatchlist(userid: string, itemid: any, itemname: any, image: any, type: any) { 
        AddWatchlistToast();
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/AddWatchlist", {params: {userid: userid, itemid: itemid, itemname: itemname, type: type, image: image}});
        router.push({
            pathname: router.pathname,
            query: { ...router.query },
        }, undefined, { scroll: false });
    }
    const RemoveWatchlistToast = () => toast.success('Removed from watchlist', {position: "bottom-right",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "dark",});
    async function RemoveWatchlist(userid: string, itemid: any, type: any) { 
        RemoveWatchlistToast();
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/RemoveWatchlist", {params: {userid: userid, itemid: itemid, type: type}});
        router.push({
            pathname: router.pathname,
            query: { ...router.query },
        }, undefined, { scroll: false });
    }

    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover h-screen">
                <div className="grid grid-cols-6 mx-auto max-w-6xl pt-6 pb-32 md:pt-16 sm:pb-40 items-stretch">
                        <img src={poster_img} alt={main.title.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
                        <div className="bg-white bg-opacity-75 shadow-md rounded-3xl md:rounded-r-3xl md:rounded-none col-span-6 md:col-span-4 pl-6 p-4">
                            <div className="hidden sm:flex p-2 py-6">
                                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-xl leading-6 ring-1 ring-gray-900/50 hover:ring-gray-900/5">
                                    <span className="text-gray-600">
                                        {tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-2">
                                <div className='flex mb-6'>
                                    <span className="z-10 text-lg rounded-lg text-black mr-4">
                                        {lang}
                                    </span>
                                    <span className="z-10 text-lg rounded-lg text-black mr-4">
                                        {main.vote_average}/10
                                    </span>
                                    {main.genres.map((genre: { id: string; name: string; }) =>
                                        <div key={genre.id} className="mr-4">
                                            <span className="z-10 text-lg rounded-lg text-black">
                                                {genre.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-4xl text-black font-bold tracking-tight sm:text-6xl drop-shadow-sm">
                                    {main.title}
                                </h1>
                                <div className="text-2xl leading-8 font-normal mt-6 text-black">
                                    {main.tagline}
                                </div>
                                <p className="mt-6 text-lg leading-8 text-black">
                                    {main.overview}
                                </p>
                                <div className="mt-6 flex gap-x-4">
                                    <a
                                        href={imdblink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition"
                                    >
                                        IMDb
                                    </a>
                                    <a
                                        href={main.homepage}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-black text-white shadow-md hover:scale-110 hover:text-black hover:bg-white ease-in-out transition"
                                    >
                                        Watch Movie
                                    </a>
                                    {session && watchlist_bool == false &&
                                        <button
                                            onClick={() => AddWatchlist(session.user.id, main.id, main.title, poster_img, "movie")}
                                            className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-zinc-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-white ease-in-out transition"
                                        >
                                            Add to watchlist
                                        </button>
                                    }
                                    {session && watchlist_bool == true &&
                                        <button
                                            onClick={() => RemoveWatchlist(session.user.id, main.id, "movie")}
                                            className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-red-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-red-300 ease-in-out transition"
                                        >
                                            Remove from watchlist
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="grid p-2 grid-cols-1 max-w-6xl m-auto">
                <div className="" ref={parent}>
                    <Topcast castcredit={credits.cast} />
                    <Topcrew crewcredit={credits.crew} />
                    <Videos videos={videos} />
                    <Recommended recommend={recommend} type="movie" />
                </div>
                <div>
                    {main.belongs_to_collection != null &&
                        <div key={main.belongs_to_collection} className="group cursor-pointer relative inline-block text-center">
                            <button onClick={() => router.push("/collection/" + main.belongs_to_collection.id)}>
                                <img id={main.belongs_to_collection.id.toString()} src={baseimg + main.belongs_to_collection.poster_path.toString()} alt={main.belongs_to_collection.name.toString()} className="rounded-3xl p-2" />
                            </button>
                        </div>
                    }
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
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