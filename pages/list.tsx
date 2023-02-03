/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import axios from 'axios';

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session)
        return {
            props: {
                userlists: [],
                loggedin: false
            }
        }

    const { data } = await supabase
    .from('listcontent')
    .select('listid, listcontent')
    .eq('userid', session?.user.id)

    return {
        props: {
            userlists: data,
            loggedin: true,
        },
    }
}

async function CreateList(userid: string, router: any) { 
    const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/CreateList", {params: {userid: userid}});
    router.push({
        pathname: '/list/[listid]',
        query: { listid: getResult.data.listid },
    })
}

export default function Lists({userlists, loggedin}: any) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const session = useSession();
    // get lists that user created.
    const display_lists = userlists.map((list: any) =>
        <>
            <div key={list.listid} className="flex justify-center p-6">
                <div className="block p-6 rounded-lg shadow-xl bg-white max-w-3xl">
                    <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">{list.listcontent.listname}</h5>
                    <p className="text-gray-700 text-base mb-4">
                        {list.listcontent.summary}
                    </p>
                    <p className='p-2' >Last updated: {list.listcontent.created}</p>
                    <a href={"/list/" + list.listid}>
                        <button type="button"
                            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                            View List
                        </button>
                    </a>
                </div>
            </div>
        </>
    );
    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/list',
            query: {},
        })
    }
    function SignOut(){
        supabase.auth.signOut();
        router.push({
            pathname: '/list',
            query: {},
        })
    }
    return (
        <>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28 m-auto text-center'>
                {!session ? (
                    <>
                        <h1 className='font-semibold text-2xl p-2'>To create/view lists you must login:</h1>
                        <p>Demo credentials:
                            <br />
                            email - matthewtlharvey@gmail.com
                            <br />
                            pass - demouser
                        </p>
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
                        <div className='max-w-lg p-10 justify-center m-auto'>
                            <p className='mb-6 text-lg font-semibold'>Logged in using - {session.user.email}</p>
                            <button onClick={()=> SignOut()} 
                                className="inline-block rounded-lg bg-red-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-red-500 hover:text-white hover:scale-110 ease-in-out transition">
                                    Sign Out
                            </button>
                            <p className='p-6 text-md font-medium'>Please note that all lists are publicly accessible via the URL, but only editible by the author.</p>
                            <button onClick={()=> CreateList(session.user.id, router)} 
                                className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">
                                    Create a new list
                            </button>
                        </div>
                        <div className='p-6 grid sm:grid-cols-1 md:grid-cols-3 max-w-7xl justify-center m-auto'>
                            {display_lists}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}