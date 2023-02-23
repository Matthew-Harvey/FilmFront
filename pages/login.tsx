/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createServerSupabaseClient, Session, SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next';
import Nav from '../components/Nav';
import router, { useRouter } from 'next/router';
import { getAvatarName } from '../functions/getAvatarName';
import axios from 'axios';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const movie = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const baseimg = "url(https://image.tmdb.org/t/p/original"
    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    movie.results.forEach((movie: { title: string; backdrop_path: string}) => {
        var imgurl = "";
        if (movie.backdrop_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.backdrop_path + ")";
        }
        movie_arr.push([movie.title, imgurl])
        counter++;
    });
    var movie_item = movie_arr[Math.floor(Math.random()*movie_arr.length)];
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
                movie_item
            }
        }
    } else {
        return {
            props: {
                loggedin: true,
                movie_item,
                username,
                avatar
            },
        }
    }
}

async function LogUserNickNames(session: Session) { 
    const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/UpsertNickname", {params: {userid: session.user.id}});
    router.back();
}

export default function Login({loggedin, movie_item, username, avatar}:any) {
    const supabase = useSupabaseClient();
    const session = useSession();
    const router = useRouter();
    if (session) {
        LogUserNickNames(session);
        //router.back();
    }
    return (
        <>
            <Nav isloggedin={loggedin} username={username} avatar={avatar} />
            <div className='grid sm:grid-cols-1 md:grid-cols-1 m-auto text-center h-screen bg-cover relative' style={{backgroundImage: movie_item[1].toString()}}>
                <div className='max-w-xl m-auto text-center text-lg bg-white rounded-xl p-20'>
                    {!session ? (
                        <>
                            <h1 className='font-semibold text-2xl p-2 text-black'>Login to MyMovies</h1>
                            <Auth
                                supabaseClient={supabase}
                                appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: 'red',
                                            brandAccent: 'darkred',
                                            messageText: "black"
                                        },
                                    },
                                },
                                }}
                            />
                            <button onClick={async ()=> await supabase.auth.signInWithPassword({email: 'matthewtlharvey@gmail.com',password: 'demouser'})}
                                className="inline-block rounded-lg bg-zinc-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-zinc-500 hover:text-white hover:scale-110 ease-in-out transition">
                                Demo User
                            </button>
                        </>
                    ) : (
                        
                        <>
                            <div>
                                <p className='mt-40 mb-2'><u><b>{session.user?.email}</b></u></p>
                                <p className='mb-4'>You are now Logged In.</p>
                                <button onClick={()=> router.back()}
                                    className="inline-block rounded-lg bg-slate-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-slate-500 hover:text-white hover:scale-110 ease-in-out transition">
                                    Return to where you left off.
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}