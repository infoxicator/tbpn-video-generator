import { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { errorAsJson } from "./lib/return-error-as-json";
import { StoryResponse } from "./remotion/schemata";

const PayloadSchema = z.object({
  storyData: StoryResponse,
});

const SHARE_SERVICE_URL = "https://imageplustexttoimage.mcp-ui-flows-nanobanana.workers.dev/api/payloads";

export const action = errorAsJson(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Error("Unsupported method");
  }

  const body = await request.json();
  const { storyData } = PayloadSchema.parse(body);
  const response = await fetch(SHARE_SERVICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storyData),
  });

  if (!response.ok) {
    throw new Error(`Share service error: ${response.status}`);
  }

  const json = (await response.json()) as { id?: string };
  if (!json?.id) {
    throw new Error("Share service did not return a share id.");
  }

  return { id: json.id };
});
