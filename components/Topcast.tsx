/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
const baseimg = "https://image.tmdb.org/t/p/w500";
import { compareSecondColumn } from "./SortSecond";

export default function Topcast( { castcredit } : any) {

    const castarr: (string | number)[][] = [];
    castcredit.forEach((person: { original_name: string; popularity: number; profile_path: string; character: string; id: number}) => {
        var imgurl = "";
        if (person.profile_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + person.original_name;
        } else {
            imgurl = baseimg + person.profile_path;
        }
        castarr.push([person.original_name, person.popularity, imgurl, person.character, person.id])
    });
    castarr.sort(compareSecondColumn);

    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(6);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = castarr.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(castarr.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(castarr.length / castperpage)) {
            setCastPage(number);
        }
    };
    const display_cast = currentcast.map((person) =>
        <div key={person[4]} className="group cursor-pointer relative inline-block text-center">
            <a href={"/person/" + person[4]}>
                <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {person[0]} as {person[3]}
                    </span>
                </div>
            </a>
        </div>
    );
    return (
        <> 
        <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
            <span>
                <span className="text-3xl leading-8 font-bold pr-4">Top Cast: </span>
                <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                <span className="font-normal text-sm"> {castpage + " / " + Math.ceil(castarr.length / castperpage)} </span>
                <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
            </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6">
            {display_cast}
        </div>
        </>
    )
}