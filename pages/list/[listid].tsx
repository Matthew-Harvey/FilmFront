/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react';
import { Reorder } from 'framer-motion';
import axios from 'axios';

const baseimg = "https://image.tmdb.org/t/p/w500";

export const getServerSideProps = async (ctx: any) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()


    const movie = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const type = "multi";

    if (!session)
        return {
            props: {
                listcontent: [],
                loggedin: false,
                serveruser: "",
                movie: movie,
                mediatype: type,
                listid: ctx.query.listid
            }
        }

    const { data } = await supabase
        .from('listcontent')
        .select('userid, created, name, summary, item_imgs, item_names')
        .eq('listid', ctx.query.listid)

    if (data == null) {
        return {
            redirect: {
              permanent: false,
              destination: "/list"
            }
          }
    } else {
        return {
            props: {
                listcontent: data,
                loggedin: true,
                // @ts-ignore
                serveruser: data[0].userid,
                movie: movie,
                mediatype: type,
                listid: ctx.query.listid
            },
        } 
    }
}

export default function Lists({listcontent, loggedin, serveruser, movie, mediatype, listid}: any) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const session = useSession();

    let popped = "";
    let itemarr = [];
    try{
        itemarr = listcontent[0].item_names.split("$%$");
        popped = itemarr.pop();
    } catch{
        listcontent = "";
    }
    const [editbool, setEdit] = useState<Boolean>(false);
    if (serveruser == session?.user.id && editbool == false) {
        setEdit(true);
    }
    const [title, setTitle] = useState(listcontent[0].name);
    const titleChange = (value: any) => {
        setTitle(value);
    }
    const [summary, setSummary] = useState(listcontent[0].summary);
    const SummaryChange = (value: any) => {
        setSummary(value);
    }
    const [items, setItems] = useState(itemarr);
    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/list',
            query: {},
        })
    }


    const [currentdata, setData] = useState(movie);
    const [query, setQuery] = useState("");

    const [currentinput, setInput] = useState("");
    const InputChange = (value: any) => {
        setInput(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/getSearchResult", {params: {searchterm: query, type: mediatype}});
            setData(getResult.data.result);
        }
        if (query != "") {
            fetchData();
        }
    }, [query]);
    
    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    currentdata.results.forEach((movie: { media_type: string, name: string, title: string; popularity: number; poster_path: string; profile_path: string, job: string; id: number}) => {
        if (movie.media_type == "movie") {
            var imgurl = "";
            if (movie.poster_path == null){
                imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
            } else {
                imgurl = baseimg + movie.poster_path;
            }
            movie_arr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter])
        } else if (movie.media_type == "tv"){
            var imgurl = "";
            if (movie.poster_path == null){
                imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
            } else {
                imgurl = baseimg + movie.poster_path;
            }
            movie_arr.push([movie.name, movie.popularity, imgurl, movie.job, movie.id, counter])
        } else {
            var imgurl = "";
            if (movie.profile_path == null){
                imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
            } else {
                imgurl = baseimg + movie.profile_path;
            }
            movie_arr.push([movie.name, movie.popularity, imgurl, movie.job, movie.id, counter])

        }
        counter+= 1
    });
    
    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(8);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = movie_arr.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(movie_arr.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const display_movies = currentcast.map((movie) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <a onClick={()=> setItems((items: any) => [...items, movie[0].toString()])}>
                <img id={movie[4].toString()} src={movie[2].toString()} alt={movie[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </a>
        </div>
    );
    return (
        <>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28 m-auto justify-center text-center'>
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
                        <div>
                            {editbool == false &&
                                <>
                                    <p className='p-2 text-center font-semibold text-5xl'>{listcontent.listname}</p>
                                    <br />
                                    <p className='p-2 text-center font-medium text-sm'>{listcontent.summary}</p>
                                    <Reorder.Group axis="y" values={items} onReorder={setItems}>
                                        {items.map((item: any) => (
                                            <Reorder.Item key={item} value={item}>
                                                <>
                                                    <div className='bg-slate-700 p-5 text-white'>
                                                        {item}
                                                    </div>
                                                </>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                </>
                            }
                            {editbool == true &&
                                <>
                                    <div className='justify-center m-auto text-center grid p-2 sm:grid-cols-1 md:grid-cols-1'>
                                        <input className='p-2 text-center font-semibold text-5xl' placeholder={listcontent[0].name} value={title} onChange={(e) => titleChange(e.target.value)} />
                                        <br />
                                        <input className='p-2 text-center font-medium text-sm' placeholder={listcontent[0].summary} value={summary} onChange={(e) => SummaryChange(e.target.value)} />
                                    </div>
                                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                                    <div className="modal">
                                        <div className="modal-box m-auto max-w-2xl">
                                            <div className="mb-3 justify-center flex text-center m-auto max-w-6xl">
                                                <div className="input-group grid items-stretch w-full mb-4 grid-cols-6">
                                                    <input value={currentinput} onChange={(e) => InputChange(e.target.value)} type="search" className="col-span-5 form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search Movie/Tv/Person" aria-label="Search" aria-describedby="button-addon2" />
                                                    <button onClick={()=> setQuery(currentinput)} className="btn px-6 py-2.5 bg-blue-600 text-white font-medium text-lg leading-tight uppercase rounded-r-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center" type="button" id="button-addon2">
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                            <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                                                {display_movies}
                                            </div>
                                            <div className="modal-action">
                                                <label htmlFor="my-modal" className="btn">Close</label>
                                            </div>
                                        </div>
                                    </div>
                                    <Reorder.Group axis="y" values={items} onReorder={setItems}>
                                        {items.map((item: any) => (
                                            <Reorder.Item key={item} value={item}>
                                                <>
                                                    <div className='bg-slate-700 p-5 text-white'>
                                                        {item}
                                                    </div>
                                                </>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                    <div className='text-center grid grid-cols-6 gap-2 p-2 justify-center m-auto'>
                                        <div></div>
                                        <div></div>
                                        <label htmlFor="my-modal" className="btn p-1 rounded-lg bg-blue-600 text-white font-medium text-lg leading-tight shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center">Add</label>
                                        <button onClick={()=> SaveContent(items, title, summary, listid)} className="btn p-1 rounded-lg bg-blue-600 text-white font-medium text-lg leading-tight shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center">Save</button>
                                    </div>
                                </>
                            }
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

async function SaveContent(items: any[], title: string, summary: string, listid: number){
    let itemstr = ""
    for (let item in items){
        itemstr+= items[item] + "$%$"
    }
    const response = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/SaveList", {params: {listid: listid, title: title, summary: summary, items: itemstr}});
}