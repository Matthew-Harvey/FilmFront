/* eslint-disable react-hooks/rules-of-hooks */
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function SaveNickname(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    const user_avatar = req.query.user_avatar;
    const supabase = createBrowserSupabaseClient();
    const {data} = await supabase.from('user_nicknames').update({avatar: user_avatar}).eq("userid", userid);
    res.status(200).json({message: "Complete"});
}