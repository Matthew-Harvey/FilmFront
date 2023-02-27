/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Nav from '../components/Nav';
import router from 'next/router';
import { getAvatarName } from '../functions/getAvatarName';
import { RatingWatchCard } from '../components/RateWatchCard';

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
    // Create authenticated Supabase Client
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

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            }
        }
    }
    const { data } = await supabase
    .from('watchlist')
    .select('itemid, itemname, type, image, added')
    .eq('userid', session?.user.id)

    return {
        props: {
            userwatchlist: data,
            loggedin: true,
            username,
            avatar
        },
    }
}

export default function Watchlist({userwatchlist, loggedin, username, avatar}: any) {
    const supabase = useSupabaseClient();
    const session = useSession();
    // get items that user added.
    let userwatchlist_movie = [];
    let userwatchlist_tv = [];
    let userwatchlist_people = [];
    for (var item in userwatchlist) {
        if (userwatchlist[item].type == "movie") {
            userwatchlist_movie.push(userwatchlist[item]);
        } else if (userwatchlist[item].type == "tv") {
            userwatchlist_tv.push(userwatchlist[item]);
        } else {
            userwatchlist_people.push(userwatchlist[item]);
        }
    }

    const item_display = (arg: any) => {
        return arg.map((item: any) =>
            <>
                <RatingWatchCard itemdata={item} type={"watchlist"} />
            </>
        );
    }

    let display_watchlist_movie;
    try{ display_watchlist_movie = item_display(userwatchlist_movie);} catch {display_watchlist_movie = <p>You have not added any movies to your watchlist.</p>};
    
    let display_watchlist_tv;
    try{ display_watchlist_tv = item_display(userwatchlist_tv);} catch {display_watchlist_tv = <p>You have not added any tv to your watchlist.</p>};
    
    let display_watchlist_people;
    try{ display_watchlist_people = item_display(userwatchlist_people);} catch {display_watchlist_people = <p>You have not added any people to your watchlist.</p>};

    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/watchlist',
            query: {},
        })
    }
    return (
        <>
            <Nav isloggedin={loggedin} username={username} avatar={avatar} />
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-6 m-auto text-center'>
                {!session ? (
                    <>
                        <div className='max-w-xl m-auto text-center text-lg'>
                            <Auth
                                supabaseClient={supabase}
                                appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                    colors: {
                                        brand: 'red',
                                        brandAccent: 'darkred',
                                    },
                                    },
                                },
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='max-w-6xl justify-center m-auto mb-20'>
                            <p className='mb-6 text-lg font-semibold'>Logged in using - {session.user.email}</p>
                            <p className="text-3xl leading-8 font-bold pr-4 pb-10 pt-6 text-left">Movies: </p>
                            <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 max-w-6xl m-auto gap-2'>
                                {display_watchlist_movie}
                            </div>
                            <p className="text-3xl leading-8 font-bold pr-4 py-10 text-left">Tv: </p>
                            <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 max-w-6xl m-auto gap-2'>
                                {display_watchlist_tv}
                            </div>
                            <p className="text-3xl leading-8 font-bold pr-4 py-10 text-left">People: </p>
                            <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 max-w-6xl m-auto gap-2'>
                                {display_watchlist_people}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}