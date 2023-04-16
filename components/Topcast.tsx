/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import router from "next/router";
import { useState } from "react";

export default function Topcast( { castcredit } : any) {
    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(6);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = castcredit.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(castcredit.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(castcredit.length / castperpage)) {
            setCastPage(number);
        }
    };
    const display_cast = currentcast.map((person:any) =>
        <div key={person[4]} className="group cursor-pointer relative inline-block text-center">
            <button onClick={() => router.push("/person/" + person[4])}>
                <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {person[0]} as {person[3]}
                    </span>
                </div>
            </button>
        </div>
    );

    const [parent] = useAutoAnimate<HTMLDivElement>();
    return (
        <> 
            <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    <div className="grid grid-flow-col">
                        {Math.ceil(castcredit.length / castperpage) > 0 && 
                            <span className="text-3xl leading-8 font-bold pr-4">Top Cast: </span>
                        }
                        {Math.ceil(castcredit.length / castperpage) > 1 && 
                            <>
                                <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                                <span className="font-normal text-sm m-auto"> {castpage + " / " + Math.ceil(castcredit.length / castperpage)} </span>
                                <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6" ref={parent}>
                {display_cast}
            </div>
        </>
    )
}