/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import router from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import axios from 'axios';
import { useState } from 'react';
import Nav from '../components/Nav';
import { getNickName } from '../functions/getNickname';

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    let username = await getNickName(session);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            }
        }
    }

    const { data } = await supabase
    .from('quizcontent')
    .select('quizid, quizcontent')
    .eq('userid', session?.user.id)

    return {
        props: {
            userquiz: data,
            loggedin: true,
            username
        },
    }
}

async function CreateQuiz(userid: string, router: any) { 
    const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/CreateQuiz", {params: {userid: userid}});
    router.push({
        pathname: '/quiz/[quizid]',
        query: { quizid: getResult.data.quizid },
    })
}

export default function Quiz(this: any, {userquiz, loggedin, username}: any) {
    const supabase = useSupabaseClient();
    const session = useSession();

    const [amountnum, setAmountNum] = useState("5");
    const [order, setOrder] = useState("");
    const [type_ofshow, setTypeOfShow] = useState("");

    function GenerateRandom(): void {
        console.log(amountnum, order, type_ofshow);
    }

    return (
        <>
            <Nav isloggedin={loggedin} username={username} />
            <div className='mt-6 m-auto'>
                <div className='grid grid-cols-1 md:grid-cols-3 max-w-6xl m-auto'>
                    <div className='p-4'>
                        <label htmlFor="type" className="block mb-2 text-m font-medium text-gray-900 dark:text-white m-auto">Type</label>
                        <select id="type" value={type_ofshow} onChange={(e) => setTypeOfShow(e.target.value)} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="mov">Movie</option>
                            <option value="tv">Tv Shows</option>
                        </select>
                    </div>
                    <div className='p-4'>
                        <label htmlFor="order" className="block mb-2 text-m font-medium text-gray-900 dark:text-white m-auto">Order By</label>
                        <select id="order" value={order} onChange={(e) => setOrder(e.target.value)} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="release">Release Date</option>
                            <option value="rev">Revenue</option>
                            <option value="score">Imdb Score</option>
                            <option value="FR">Length</option>
                        </select>
                    </div>
                    <div className='p-4'>
                        <label htmlFor="amountnum" className="block mb-2 text-m font-medium text-gray-900 dark:text-white m-auto">Amount</label>
                        <input id="amountnum" value={amountnum} onChange={(e) => setAmountNum(e.target.value)} type="number" className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                </div>
                <div className="grid grid-cols-2 max-w-6xl m-auto py-4 gap-6">
                    <button onClick={()=> GenerateRandom()} 
                        className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">
                         Generate Random Trivia 
                    </button>
                    <button onClick={()=> GenerateRandom()} 
                        className="inline-block rounded-lg bg-slate-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-slate-500 hover:text-white hover:scale-110 ease-in-out transition">
                         Create Custom Trivia 
                    </button>
                </div>
            </div>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28 m-auto'>
                {!session ? (
                    <>
                        <div className='max-w-xl m-auto text-center text-lg'>
                            <h1 className='font-semibold text-2xl p-2'>To view historic data login below:</h1>
                            <p>Demo credentials:
                                <br />
                                email - matthewtlharvey@gmail.com
                                <br />
                                pass - demouser
                            </p>
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
                        <div className='max-w-6xl p-10 justify-center m-auto'>
                            <p className='mb-6 text-lg font-semibold'>Logged in using - {session.user.email}</p>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}