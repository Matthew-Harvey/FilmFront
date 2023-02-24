import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js"

export async function getProfileStats(session: Session | null) {
    const supabase = createBrowserSupabaseClient();
    const list = await supabase.from('listcontent').select().eq('userid', session?.user.id.toString());
    const watchlist = await supabase.from('watchlist').select().eq('userid', session?.user.id.toString());
    const rating = await supabase.from('rating').select().eq('userid', session?.user.id.toString());
    const trivia = await supabase.from('quizcontent').select().eq('userid', session?.user.id.toString());
    return {lists: list?.data?.length, watchlist: watchlist?.data?.length, rating: rating?.data?.length, trivia: trivia?.data?.length};
}