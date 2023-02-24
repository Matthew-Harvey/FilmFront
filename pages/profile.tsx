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
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

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

    return {
        props: {
            loggedin: true,
            username,
            avatar
        },
    }
}

export default function Profile({loggedin, username, avatar}: any) {
    const supabase = useSupabaseClient();
    const session = useSession()
    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/profile',
            query: {},
        })
    }
    let [user_avatar, setAvatar] = useState(avatar);
    function selectAvatar(count: number) {
        setAvatar(count);
    }
    let avatar_list = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const display_avatar_list = avatar_list.map((count) =>
        <div key={count} className="group cursor-pointer" onClick={() => selectAvatar(count)}>
            {user_avatar == count &&
                <img alt="avatar" src={"/avatar" + count + ".svg"} width="60%" className='bg-zinc-600 rounded-xl' />
            }
            {user_avatar != count &&
                <img alt="avatar" src={"/avatar" + count + ".svg"} width="60%" className='' />
            }
        </div>
    );
    let [nickname, setNickname] = useState(username);
    const InputChange = (value: any) => {
        setNickname(value);
    }
    async function saveAvatar(user_avatar: number) {
        saveAvatarToast();
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/SaveAvatar", {params: {user_avatar: user_avatar, userid: session?.user.id}});
        router.replace(router.asPath);
    }
    async function saveNickName(nickname: string) {
        saveNicknameToast();
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/SaveNickname", {params: {nickname: nickname, userid: session?.user.id}});
        router.replace(router.asPath);
    }
    const saveAvatarToast = () => toast.success('Saved List', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    const saveNicknameToast = () => toast.success('Saved Nickname', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
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
                        <div className='max-w-6xl m-auto'>
                            <div className='grid grid-cols-3 justify-center gap-3 text-left mt-10'>
                                <div>
                                    <span className="text-3xl leading-8 font-bold pr-4 text-left">Your Stats: </span>
                                </div>
                            </div>
                            <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                                <div className="grid grid-cols-2 row-gap-8 md:grid-cols-4">
                                    <div className="text-center md:border-r">
                                        <h6 className="text-4xl font-bold lg:text-5xl xl:text-6xl">144K</h6>
                                        <p className="text-sm font-medium tracking-widest text-blue-800 uppercase lg:text-base">
                                            Lists
                                        </p>
                                    </div>
                                    <div className="text-center md:border-r">
                                        <h6 className="text-4xl font-bold lg:text-5xl xl:text-6xl">12.9K</h6>
                                        <p className="text-sm font-medium tracking-widest text-blue-800 uppercase lg:text-base">
                                            Watchlist
                                        </p>
                                    </div>
                                    <div className="text-center md:border-r">
                                        <h6 className="text-4xl font-bold lg:text-5xl xl:text-6xl">48.3K</h6>
                                        <p className="text-sm font-medium tracking-widest text-blue-800 uppercase lg:text-base">
                                            Ratings
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <h6 className="text-4xl font-bold lg:text-5xl xl:text-6xl">24.5K</h6>
                                        <p className="text-sm font-medium tracking-widest text-blue-800 uppercase lg:text-base">
                                            Trivia
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-3 justify-center gap-3 text-left mt-10'>
                                <div>
                                    <span className="text-3xl leading-8 font-bold pr-4 text-left">Nickname: </span>
                                </div>
                            </div>
                            <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
                                <div className="grid grid-cols-1 row-gap-8 md:grid-cols-1">
                                    <div className='flex m-auto'>
                                        <input type="text" onChange={(e) => InputChange(e.target.value)} placeholder={username} value={nickname} style={{borderTopLeftRadius:"0.5rem", borderBottomLeftRadius:"0.5rem", borderTopRightRadius:"0px", borderBottomRightRadius:"0px"}} className="input text-black w-full max-w-sm"  />
                                        <button type="button"
                                            onClick={() => saveNickName(nickname)}
                                            className="rounded-r-lg bg-blue-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">
                                            Save
                                        </button>
                                    </div>
                                    <span className='mt-6'>This will appear in the top right dropdown when logged into this account.</span>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 justify-center m-auto gap-3 text-left mt-10'>
                                <div>
                                    <span className="text-3xl leading-8 font-bold pr-4 text-left">Selected Avatar: </span>  
                                    <button type="button"
                                        onClick={() => saveAvatar(user_avatar)}
                                        className="justify-center text-center m-auto inline-block rounded-lg bg-blue-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">
                                        Save
                                    </button>                                  
                                    <img alt="avatar" src={"/avatar" + user_avatar + ".svg"} width="100%" />
                                </div>
                                <div className='col-span-2 grid grid-cols-2 md:grid-cols-4'>
                                    {display_avatar_list}
                                </div>
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
                            theme="light"
                        />
                    </>
                )}
            </div>
        </>
    )
}