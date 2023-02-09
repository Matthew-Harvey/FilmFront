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
                userquiz: [],
                loggedin: false
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

export default function Quiz({userquiz, loggedin}: any) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const session = useSession();
    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/trivia',
            query: {},
        })
    }
    function SignOut(){
        supabase.auth.signOut();
        router.push({
            pathname: '/trivia',
            query: {},
        })
    }
    return (
        <>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28 m-auto'>
                {!session ? (
                    <>
                        <h1 className='font-semibold text-2xl p-2'>To complete trivia  you must login:</h1>
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
                        <div className='max-w-6xl p-10 justify-center m-auto'>
                            <p className='mb-6 text-lg font-semibold'>Logged in using - {session.user.email}</p>
                            <button onClick={()=> SignOut()} 
                                className="inline-block rounded-lg bg-red-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-red-500 hover:text-white hover:scale-110 ease-in-out transition">
                                    Sign Out
                            </button>
                            <p className='p-6 text-md font-medium'>Please note that all quizes are publicly accessible, but only editible by the author.</p>
                            <button onClick={()=> CreateQuiz(session.user.id, router)} 
                                className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">
                                    Create a new quiz
                            </button>
                        </div>
                        <div className='grid grid-cols-2 max-w-6xl m-auto'>
                        <label htmlFor="countries" className="block mb-2 text-m font-medium text-gray-900 dark:text-white m-auto">Select an option</label>
                        <select id="countries" className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>Choose a country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}