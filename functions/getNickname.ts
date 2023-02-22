import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js"

export async function getNickName (session: Session | null) {
    const supabase = createBrowserSupabaseClient();
    const { data } = await supabase.from('user_nicknames').select("nickname").eq('userid', session?.user.id.toString())
    try {
        // @ts-ignore
        return data[0].nickname
    } catch {
        return ""
    }
}