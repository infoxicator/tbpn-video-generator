import { Player } from "@remotion/player";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DURATION_IN_FRAMES,
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
} from "./remotion/constants.mjs";
import "./app.css";
import { z } from "zod";
import { Main } from "./remotion/components/Main";
import { RenderControls } from "./components/RenderControls";
import { Spacing } from "./components/Spacing";
import { StoryResponse } from "./remotion/schemata";
import { Loading } from "./components/Loading";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { InputContainer } from "./components/InputContainer";
import { AlignEnd } from "./components/AlignEnd";

type BlogLoaderData = {
  profilePic?: string | null;
  name?: string | null;
  company?: string | null;
  storyData?: z.infer<typeof StoryResponse> | null;
};

export async function clientLoader({ request }: { request: Request }): Promise<BlogLoaderData> {
  const url = new URL(request.url);
  const profilePic = url.searchParams.get("image");
  const name = url.searchParams.get("name");
  const company = url.searchParams.get("company");

  if (!profilePic || !name || !company) {
    return { profilePic: null, name: null, company: null, storyData: null };
  }

  try {
    // Using POST for reliability since browsers ignore GET bodies
    const res = await fetch(
      "https://postman.flows.pstmn.io/api/default/get-mcp-ui-stories",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profilePic,
          company,
        }),
      }
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();

    // Extract story data from nested content structure
    const content = Array.isArray(data?.content) ? data.content : [];
    const initial = content
      .map((item: any) => item?.resource?._meta?.["mcpui.dev/ui-initial-render-data"]) // prefer key access with brackets
      .find((val: any) => Boolean(val));

    const parsed = StoryResponse.safeParse(initial);
    if (!parsed.success) throw parsed.error;
    return { profilePic, name, company, storyData: parsed.data };
  } catch (_err) {
    // On error, keep UI visible and allow retry via input
    return { profilePic, name, company, storyData: null };
  }
}

export function HydrateFallback() {
  return (
    <div className="max-w-screen-md m-auto mb-5">
      <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16 bg-background">
        <div className="aspect-[9/16] flex items-center justify-center">
          <Loading compact title="Rendering video…" subtitle="Fetching blog content and preparing assets" />
        </div>
      </div>
    </div>
  );
}

export default function Blog({ loaderData }: { loaderData: BlogLoaderData }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [nameInput, setNameInput] = useState(loaderData.name ?? "");
  const [profileInput, setProfileInput] = useState(loaderData.profilePic ?? "");
  const [companyInput, setCompanyInput] = useState(loaderData.company ?? "");
  const [text, setText] = useState("MCP-Ui 🤝 Remotion");

  const storyData = loaderData.storyData ?? undefined;
  const inputProps: z.infer<typeof StoryResponse> | undefined = useMemo(() => {
    return storyData;
  }, [storyData]);

  // Keep the input prefilled with the latest query param and clear pending after load
  useEffect(() => {
    setNameInput(loaderData.name ?? "");
    setProfileInput(loaderData.profilePic ?? "");
    setCompanyInput(loaderData.company ?? "");
    setPending(false);
  }, [loaderData.name, loaderData.profilePic, loaderData.company, loaderData.storyData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    const trimmedProfile = profileInput.trim();
    const trimmedCompany = companyInput.trim();
    if (!trimmedName || !trimmedProfile || !trimmedCompany) {
      return;
    }
    setPending(true);
    // Navigate to same route with ?name=&image=&company=
    const searchParams = new URLSearchParams({
      name: trimmedName,
      image: trimmedProfile,
      company: trimmedCompany,
    });
    navigate(`/blog?${searchParams.toString()}`);
  }

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        {/* URL input form */}
        <form onSubmit={handleSubmit} className="mt-10 mb-6">
          <InputContainer>
            <label className="text-sm text-subtitle mb-2">Name</label>
            <Input
              disabled={pending}
              text={nameInput}
              setText={setNameInput}
              placeholder="Enter the subject's name"
            />
          </InputContainer>
          <InputContainer>
            <label className="text-sm text-subtitle mb-2">Profile Image URL</label>
            <Input
              disabled={pending}
              text={profileInput}
              setText={setProfileInput}
              placeholder="https://example.com/avatar.jpg"
            />
          </InputContainer>
          <InputContainer>
            <label className="text-sm text-subtitle mb-2">Company</label>
            <Input
              disabled={pending}
              text={companyInput}
              setText={setCompanyInput}
              placeholder="Where do they work?"
            />
            <AlignEnd>
              <div className="mt-3">
                <Button loading={pending} disabled={pending}>
                  Load
                </Button>
              </div>
            </AlignEnd>
          </InputContainer>
        </form>

        {/* Only render the player once we have story data */}
        {pending || !inputProps ? (
          <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-6 bg-background">
            <div className="aspect-[9/16] flex items-center justify-center">
              <Loading
                compact
                title="Rendering video…"
                subtitle="🤖 *beep boop* AI neurons firing... pixels assembling... magic happening..."
              />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-6">
            <Player
              component={Main}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={COMPOSITION_FPS}
              compositionHeight={COMPOSITION_HEIGHT}
              compositionWidth={COMPOSITION_WIDTH}
              style={{ width: "100%" }}
              controls
              autoPlay
              loop
            />
          </div>
        )}
        {inputProps ? (
          <RenderControls text={text} setText={setText} inputProps={inputProps} />
        ) : null}
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
      </div>
    </div>
  );
}
