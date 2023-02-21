/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next';
import Nav from '../components/Nav';
import { useRouter } from 'next/router';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        return {
            props: {
                loggedin: false
            }
        }
    } else {
        return {
            props: {
                loggedin: true
            },
        }
    }
}

export default function Login({loggedin}:any) {
    const supabase = useSupabaseClient();
    const session = useSession();
    const router = useRouter();
    if (session) {
        router.back();
    }
    return (
        <>
            <Nav isloggedin={loggedin} />
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-6 m-auto text-center'>
                <div className='max-w-xl m-auto text-center text-lg'>
                    {!session ? (
                        <>
                            <h1 className='font-semibold text-2xl p-2'>Login to MyMovies</h1>
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