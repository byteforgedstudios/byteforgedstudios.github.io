import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email, reason } = await req.json();

    if (!email) {
      return new Response("Email is required", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // ⚠️ only inside function
    );

    const { error } = await supabase
      .from("deletion_requests")
      .insert([{ email, reason }]);

    if (error) {
      console.error("Insert error:", error);
      return new Response("Failed to save request", { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Request submitted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Handler error:", err);
    return new Response("Invalid request", { status: 400 });
  }
});
