/* eslint-disable @next/next/no-img-element */
import router from "next/router";
import { baseimg } from "../functions/baseimg";

export function Collection ({ collection } : any) {
    return (
        <>
            <div>
                    {collection != null &&
                        <div key={collection.id} className="group cursor-pointer relative inline-block text-center">
                            <button onClick={() => router.push("/collection/" + collection.id)}>
                                <img id={collection.id} src={baseimg + collection.poster_path} alt={collection.name} className="rounded-3xl p-2" />
                            </button>
                        </div>
                    }
            </div>
        </>
    )
}