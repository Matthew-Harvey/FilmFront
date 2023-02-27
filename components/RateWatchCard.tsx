import router from "next/router";

export function RatingWatchCard ({type, itemdata} : any) {
  return (
    <>
        <div className="relative flex flex-col h-full min-w-0 p-4 break-words shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="relative h-full overflow-hidden bg-cover rounded-xl bg-no-repeat bg-center hover:scale-105 transition" style={{backgroundImage: "url(" + itemdata.image + ")"}} onClick={() => router.push("/" + itemdata.type + "/" + itemdata.itemid)} key={itemdata.itemid}>
                <span className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-gray-900 to-slate-800 opacity-80"></span>
                <div className="relative z-10 flex flex-col flex-auto h-full p-4">
                <h5 className="pt-2 mb-6 font-bold text-white">{itemdata.itemname}</h5>
                <p className="text-white mb-4">{itemdata.comment}</p>
                {type == "rating" && 
                    <p className="mt-auto mb-0 font-semibold leading-normal text-white group text-sm">
                        {itemdata.rating}/100
                    </p>
                }
                <p className="mt-auto mb-0 font-semibold leading-normal text-white group text-sm">{itemdata.added}</p>
                </div>
            </div>
        </div>
    </>
  );
};
