import { Player } from "@remotion/player";
import { useEffect, useState } from "react";
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
import { ImageUpload } from "./components/ImageUpload";

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
  const [pending, setPending] = useState(false);
  const [nameInput, setNameInput] = useState(loaderData.name ?? "");
  const [companyInput, setCompanyInput] = useState(loaderData.company ?? "");
  const [text, setText] = useState("MCP-Ui 🤝 Remotion");

  const [storyData, setStoryData] = useState<z.infer<typeof StoryResponse> | undefined>(
    loaderData.storyData ?? undefined
  );
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    loaderData.profilePic ?? null
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputProps = storyData;

  // Keep the input prefilled with the latest query param and clear pending after load
  useEffect(() => {
    setNameInput(loaderData.name ?? "");
    setSelectedProfileFile(null);
    setProfileImageUrl(loaderData.profilePic ?? null);
    setCompanyInput(loaderData.company ?? "");
    setStoryData(loaderData.storyData ?? undefined);
    setError(null);
    setUploadingImage(false);
    setPending(false);
  }, [loaderData.name, loaderData.profilePic, loaderData.company, loaderData.storyData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = nameInput.trim();
    const trimmedCompany = companyInput.trim();
    if (!trimmedName || !trimmedCompany) {
      setError("Please provide a name and company");
      return;
    }
    if (uploadingImage) {
      setError("Please wait for the image upload to finish");
      return;
    }

    if (!profileImageUrl) {
      setError("Please select an image to upload");
      return;
    }
    setPending(true);
    try {
      const res = await fetch(
        "https://postman.flows.pstmn.io/api/default/get-mcp-ui-stories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            profilePic: profileImageUrl,
            company: trimmedCompany,
          }),
        }
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      const content = Array.isArray(data?.content) ? data.content : [];
      const initial = content
        .map((item: any) => item?.resource?._meta?.["mcpui.dev/ui-initial-render-data"])
        .find((val: any) => Boolean(val));

      const parsed = StoryResponse.safeParse(initial);
      if (!parsed.success) throw parsed.error;
      setStoryData(parsed.data);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Failed to load story";
      setError(errMessage);
      setStoryData(undefined);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        {/* Story input form */}
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
            <label className="text-sm text-subtitle mb-2">Profile Image</label>
            <ImageUpload
              disabled={pending}
              initialImageUrl={profileImageUrl}
              onFileSelect={setSelectedProfileFile}
              onImageUploaded={setProfileImageUrl}
              onUploadingChange={setUploadingImage}
              selectedFile={selectedProfileFile}
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
                <Button loading={pending || uploadingImage} disabled={pending || uploadingImage}>
                  Load
                </Button>
              </div>
            </AlignEnd>
          </InputContainer>
        </form>
        {error ? (
          <div className="text-red-500 text-sm mb-6">{error}</div>
        ) : null}

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
