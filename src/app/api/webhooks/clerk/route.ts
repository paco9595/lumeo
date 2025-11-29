import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { ClerkWebhookEvent } from "@/types/clerk";
import { createClient } from "@/lib/supabase/createServerClient";


export async function POST(req: Request) {
  const supabase = await createClient()
  const payload = await req.text();
  const headerList = await headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: ClerkWebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    await supabase
      .from("profiles")
      .upsert({
        id: data.id,
        email: data.email_addresses?.[0]?.email_address ?? "",
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        image_url: data.image_url ?? "",
      });
  } else if (type === "user.deleted") {
    await supabase.from("profiles").delete().eq("id", data.id);
  }

  return NextResponse.json({ ok: true });
}