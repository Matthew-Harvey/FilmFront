/* eslint-disable react-hooks/rules-of-hooks */
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateList(req: NextApiRequest, res: NextApiResponse<any>) {
    const listid = req.query.listid;
    const summary = req.query.summary;
    const title = req.query.title;
    const items = req.query.items;
    const datecreated = new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
        .from('listcontent')
        .update({ listcontent: {listname: title, created: datecreated, listid: listid, summary: summary, items: items}})
        .eq('listid', listid)
    res.status(200).json({message: error});
}