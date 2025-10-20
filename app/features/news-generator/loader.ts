import { StoryResponse } from "~/remotion/schemata";
import type { GeneratorLoaderData } from "./types";

export async function clientLoader({ request }: { request: Request }): Promise<GeneratorLoaderData> {
  const url = new URL(request.url);
  const profilePic = url.searchParams.get("image");
  const name = url.searchParams.get("name");
  const company = url.searchParams.get("company");

  if (!profilePic || !name || !company) {
    return { profilePic: null, name: null, company: null, storyData: null };
  }

  try {
    const res = await fetch("https://postman.flows.pstmn.io/api/default/get-mcp-ui-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        profilePic,
        company,
      }),
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();

    const content = Array.isArray(data?.content) ? data.content : [];
    const initial = content
      .map((item: any) => item?.resource?._meta?.["mcpui.dev/ui-initial-render-data"])
      .find((val: any) => Boolean(val));

    const parsed = StoryResponse.safeParse(initial);
    if (!parsed.success) throw parsed.error;
    return { profilePic, name, company, storyData: parsed.data };
  } catch (_err) {
    return { profilePic, name, company, storyData: null };
  }
}
