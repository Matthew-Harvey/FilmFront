/* eslint-disable react-hooks/rules-of-hooks */
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function AddWatchlist(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    let itemid = req.query.itemid;
    let itemname = req.query.itemname;
    let image = req.query.image;
    let type = req.query.type;
    const added = new Date().toLocaleDateString("en-GB").toString();
    const supabase = createBrowserSupabaseClient();
    const {error, data} = await supabase.from('watchlist').insert({ userid: userid, itemid: itemid, type: type, itemname: itemname, image: image, added: added});
    res.status(200).json({message: "Added to watchlist!", data: data, error: error});
}