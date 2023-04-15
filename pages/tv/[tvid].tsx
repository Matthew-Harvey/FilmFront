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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Hero } from '../../components/Hero';

const baseimg = "https://image.tmdb.org/t/p/w500";

export const getServerSideProps = async (ctx: any) => {
    const supabase = createServerSupabaseClient(ctx);
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

    let { data } = await supabase.from('store_api').select().eq("created_at", new Date().toDateString());
    let already_exists = false;
    let response = "";
    // @ts-ignore
    try {already_exists = (data[0].created_at == new Date().toDateString()); response = data[0];} catch {already_exists = false;}
    if (already_exists == false) {
        response = await fetch('https://api.themoviedb.org/3/configuration/languages' + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        await supabase.from('store_api').insert({ id: new Date().getTime(), created_at: new Date().toDateString(), content: response})
    }

    // Fetch data from external API
    const tvid = ctx.query.tvid;
    let itemresponse = await supabase.from('itemresponse').select().eq("id", tvid).eq("type", "tv");
    let does_exist = false;
    let main= null;
    let videos= null;
    let recommend= null;
    let credits= null;
    // @ts-ignore
    try {if(itemresponse.data[0]){does_exist = true; main = itemresponse.data[0].main; credits = itemresponse.data[0].credits; recommned = itemresponse.data[0].recommend; videos = itemresponse.data[0].videos}}
    catch {does_exist = false;}
    if (does_exist == false) {
        main = await fetch("https://api.themoviedb.org/3/tv/" + tvid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        credits = await fetch("https://api.themoviedb.org/3/tv/" + tvid + "/credits?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        recommend = await fetch("https://api.themoviedb.org/3/tv/" + tvid + "/recommendations?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        videos = await fetch("https://api.themoviedb.org/3/tv/" + tvid + "/videos?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());   
        await supabase.from('itemresponse').insert({ id: tvid, type: "tv", main: main, credits: credits, recommend: recommend, videos: videos})
    }

    // @ts-ignore
    let is_watchlist = await supabase.from('watchlist').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "tv");
    let watchlist_bool = false;
    // @ts-ignore
    if (is_watchlist.data?.length > 0) {
        watchlist_bool = true;
    }

    // @ts-ignore
    let is_rating = await supabase.from('rating').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "tv");
    let rating_bool = false;
    // @ts-ignore
    if (is_rating.data?.length > 0) {rating_bool = is_rating.data[0];};

    // Pass data to the page via props
    return { props: { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool, rating_bool} }
}

export default function DisplayTv( { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool, rating_bool} : any) {
    const [parent] = useAutoAnimate<HTMLDivElement>();
    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <Hero main={main} response={response} watchlist_bool={watchlist_bool} rating_bool={rating_bool} type={"tv"} />
            <div className="grid p-2 grid-cols-1 max-w-6xl m-auto pb-40">
                <div className="" ref={parent}>
                    <Topcast castcredit={credits.cast} />
                    <Topcrew crewcredit={credits.crew} />
                    <Videos videos={videos} />
                    <Recommended recommend={recommend} type="tv" />
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