/* eslint-disable @next/next/no-img-element */
import {compareSecondColumn} from "./SortSecond";

const baseimg = "https://image.tmdb.org/t/p/w500";

export default function Recommended ({ recommend, type } : any) {
    const rec_arr: (string | number)[][] = [];
    var counter = 0;
    if (type == "movie") {
        recommend.results.forEach((movie: { title: string; popularity: number; poster_path: string; job: string; id: number, media_type: string}) => {
            var imgurl = "";
            if (movie.poster_path == null){
                imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
            } else {
                imgurl = baseimg + movie.poster_path;
            }
            var hrefrec = "";
            if (movie.media_type == "tv") {
                hrefrec = "/tv/" + movie.id;
            } else {
                hrefrec = "/movie/" + movie.id;
            }
            rec_arr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter, hrefrec])
            counter++;
        });
    } else {
        recommend.results.forEach((movie: { name: string; popularity: number; poster_path: string; job: string; id: number, media_type: string}) => {
            var imgurl = "";
            if (movie.poster_path == null){
                imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
            } else {
                imgurl = baseimg + movie.poster_path;
            }
            var hrefrec = "";
            if (movie.media_type == "tv") {
                hrefrec = "/tv/" + movie.id;
            } else {
                hrefrec = "/movie/" + movie.id;
            }
            rec_arr.push([movie.name, movie.popularity, imgurl, movie.job, movie.id, counter, hrefrec])
            counter++;
        });
    }
    rec_arr.sort(compareSecondColumn);
    rec_arr.length = 6;
    const rec_result = rec_arr.map((movie : any) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <a href={movie[6]}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
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
            <div className="text-3xl leading-8 font-bold pr-4 mt-6">Recommended: </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6">
                {rec_result}
            </div> 
        </>
    )
}