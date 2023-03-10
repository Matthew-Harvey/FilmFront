/* eslint-disable react-hooks/rules-of-hooks */
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateList(req: NextApiRequest, res: NextApiResponse<any>) {
    const quizid = req.query.quizid;
    const summary = req.query.summary;
    const title = req.query.title;
    const items = req.query.items;
    const datecreated = new Date().toLocaleTimeString("en-GB") + " " + new Date().toLocaleDateString();
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
        .from('quizcontent')
        .update({ quizcontent: {quizname: title, created: datecreated, quizid: quizid, summary: summary, items: items}})
        .eq('quizid', quizid)
    res.status(200).json({message: error});
}