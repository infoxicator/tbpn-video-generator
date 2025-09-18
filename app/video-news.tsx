import { Player } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
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
import { ImageUpload, ImageUploadHandle } from "./components/ImageUpload";

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
  const [promptInput, setPromptInput] = useState("");

  const [storyData, setStoryData] = useState<z.infer<typeof StoryResponse> | undefined>(
    loaderData.storyData ?? undefined
  );
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    loaderData.profilePic ?? null
  );
  const [profileUrlInput, setProfileUrlInput] = useState(loaderData.profilePic ?? "");
  const [imageMode, setImageMode] = useState<"upload" | "url">(() => {
    const incoming = loaderData.profilePic ?? "";
    return incoming && incoming.startsWith("http") ? "url" : "upload";
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const imageUploadRef = useRef<ImageUploadHandle | null>(null);

  const inputProps = storyData;

  // Keep the input prefilled with the latest query param and clear pending after load
  useEffect(() => {
    setNameInput(loaderData.name ?? "");
    setSelectedProfileFile(null);
    const incomingPic = loaderData.profilePic ?? null;
    const nextMode = incomingPic && incomingPic.startsWith("http") ? "url" : incomingPic ? "upload" : "upload";
    setImageMode(nextMode);
    setProfileImageUrl(nextMode === "upload" ? incomingPic : null);
    setProfileUrlInput(incomingPic ?? "");
    setCompanyInput(loaderData.company ?? "");
    setStoryData(loaderData.storyData ?? undefined);
    setPromptInput("");
    setError(null);
    setUploadingImage(false);
    setPending(false);
  }, [loaderData.name, loaderData.profilePic, loaderData.company, loaderData.storyData]);

  useEffect(() => {
    if (!pending && inputProps) {
      playerContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [pending, inputProps]);

  const handleImageModeChange = (
    mode: "upload" | "url",
    options: { openDialog?: boolean } = {},
  ) => {
    if (mode === imageMode) {
      if (mode === "upload" && options.openDialog) {
        imageUploadRef.current?.openFileDialog();
      }
      return;
    }
    setImageMode(mode);
    setError(null);
    if (mode === "upload") {
      setProfileImageUrl(null);
    } else {
      setSelectedProfileFile(null);
      setProfileImageUrl(null);
      setUploadingImage(false);
    }

    if (mode === "upload" && options.openDialog) {
      setTimeout(() => {
        imageUploadRef.current?.openFileDialog();
      }, 0);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = nameInput.trim();
    const trimmedCompany = companyInput.trim();
    const trimmedPrompt = promptInput.trim();
    if (!trimmedName || !trimmedCompany) {
      setError("We need a name and future employer to stir the rumor mill.");
      return;
    }
    if (uploadingImage) {
      setError("Hang tight—our upload gremlins are still finishing their magic.");
      return;
    }

    const resolvedProfilePic = imageMode === "upload" ? profileImageUrl : profileUrlInput.trim();

    if (!resolvedProfilePic) {
      setError("Glamour shot required—upload one or drop in a URL so the tabloids have art.");
      return;
    }
    if (imageMode === "url" && !/^https?:\/\//i.test(resolvedProfilePic)) {
      setError("The URL needs to start with http:// or https:// so we can fetch their glam photo.");
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
            profilePic: resolvedProfilePic,
            company: trimmedCompany,
            ...(trimmedPrompt ? { prompt: trimmedPrompt } : {}),
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
      setError(`Our gossip hotline glitched: ${errMessage}`);
      setStoryData(undefined);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="bg-[#05060d] tbpn-body min-h-screen text-[#f4f6ff] pb-16">
      <div className="max-w-screen-lg m-auto px-6 md:px-10">
        {/* Story input form */}
        <form onSubmit={handleSubmit}>
          <div className="tbpn-panel px-7 py-9 md:px-12 md:py-12 flex flex-col gap-7 text-[#e1fff5]">
            <div>
              <p className="tbpn-chip">Rumor Intake</p>
              <h2 className="tbpn-headline text-4xl md:text-5xl text-white mt-4">Let's script their grand exit</h2>
              <p className="text-sm md:text-base text-[#b5f9db] mt-4 max-w-2xl">
                Spill the details—who's peacing out, where they’re landing, and which promo pic belongs on the farewell ticker.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
              <label className="tbpn-label">Star of the show</label>
                <Input
                  disabled={pending}
                  text={nameInput}
                  setText={setNameInput}
                  placeholder="e.g. Casey the Code Whisperer"
                  className="mt-3 bg-[#050b09] border-[#1c5f47] focus:border-[#28fcb0] text-[#e1fff5] placeholder:text-[#3f7f68]"
                />
                <p className="text-xs text-[#6fdab2] mt-3">We'll splash this name across the chyron like breaking news.</p>
              </div>

              <div>
                <label className="tbpn-label">New gig aka the destination</label>
                <Input
                  disabled={pending}
                  text={companyInput}
                  setText={setCompanyInput}
                  placeholder="Where are they defecting to?"
                  className="mt-3 bg-[#050b09] border-[#1c5f47] focus:border-[#28fcb0] text-[#e1fff5] placeholder:text-[#3f7f68]"
                />
                <p className="text-xs text-[#6fdab2] mt-3">Name the shiny new playground so we can hype their next chapter.</p>
              </div>

              <div>
                <label className="tbpn-label">Add insider intel (optional)</label>
                <Input
                  disabled={pending}
                  text={promptInput}
                  setText={setPromptInput}
                  placeholder="Optional details to add to this story i.e. insider information about the move"
                  className="mt-3 bg-[#050b09] border-[#1c5f47] focus:border-[#28fcb0] text-[#e1fff5] placeholder:text-[#3f7f68]"
                />
                <p className="text-xs text-[#6fdab2] mt-3">Spill any extra tea that should make the reel juicier.</p>
              </div>

              <div>
                <label className="tbpn-label">Choose their glamour shot</label>
                <p className="text-xs text-[#6fdab2] mt-3">Upload a file or toss in a URL—whichever makes their farewell look legendary.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={`px-4 py-2 text-xs tbpn-subheadline rounded-full border transition-colors duration-150 tracking-[0.2em] ${
                      imageMode === "upload"
                        ? "border-[#2df7a7] bg-[#0c1f18] text-[#e8fff5]"
                        : "border-[#104b38] bg-[#050b09] text-[#7cdcb0] hover:text-white hover:border-[#1c825c]"
                    }`}
                    onClick={() => handleImageModeChange("upload", { openDialog: true })}
                    aria-pressed={imageMode === "upload"}
                  >
                    Upload file
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-xs tbpn-subheadline rounded-full border transition-colors duration-150 tracking-[0.2em] ${
                      imageMode === "url"
                        ? "border-[#2df7a7] bg-[#0c1f18] text-[#e8fff5]"
                        : "border-[#104b38] bg-[#050b09] text-[#7cdcb0] hover:text-white hover:border-[#1c825c]"
                    }`}
                    onClick={() => handleImageModeChange("url")}
                    aria-pressed={imageMode === "url"}
                  >
                    Paste a URL
                  </button>
                </div>

                {imageMode === "upload" ? (
                  <div className="mt-5">
                    <ImageUpload
                      ref={imageUploadRef}
                      disabled={pending}
                      initialImageUrl={profileImageUrl}
                      onFileSelect={setSelectedProfileFile}
                      onImageUploaded={setProfileImageUrl}
                      onUploadingChange={setUploadingImage}
                      selectedFile={selectedProfileFile}
                    />
                  </div>
                ) : null}

                {imageMode === "url" ? (
                  <div className="mt-5 space-y-3">
                    <Input
                      disabled={pending}
                      text={profileUrlInput}
                      setText={setProfileUrlInput}
                      placeholder="https://example.com/their-glow-up.png"
                      className="bg-[#050b09] border-[#1c5f47] focus:border-[#28fcb0] text-[#e1fff5] placeholder:text-[#3f7f68]"
                      type="url"
                    />
                    {profileUrlInput.trim() ? (
                      <div>
                        <img
                          src={profileUrlInput.trim()}
                          alt="Profile preview"
                          className="max-h-48 rounded-[18px] object-cover border border-[#2b3a66]"
                        />
                      </div>
                    ) : null}
                    <p className="text-xs text-[#6fdab2]">
                      Make sure the link is public so our gossip bots can fetch it.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {error ? (
              <div className="rounded-[18px] border border-[#ff88d5] bg-[#2b0a25] text-[#ffd8f1] text-sm px-5 py-4 shadow-[0_0_25px_rgba(255,119,200,0.35)]">
                {error}
              </div>
            ) : null}

            <div className="flex justify-center">
              <Button
                type="submit"
                loading={pending || uploadingImage}
                disabled={pending || uploadingImage}
                className="tbpn-headline tracking-[0.22em] text-sm h-12 px-8 bg-[#00b06f] text-black border-0 hover:bg-[#00dd8b] disabled:bg-[#0f3a28] disabled:text-[#76cbaa]"
              >
                Spin the rumor reel
              </Button>
            </div>
          </div>
        </form>

        {/* Only render the player once we have story data */}
        <div ref={playerContainerRef} className="mx-auto w-full max-w-[360px]">
          {pending ? (
            <div className="relative overflow-hidden rounded-[28px] mb-12 mt-8 border border-[#19cc8d] shadow-[0_45px_140px_rgba(12,64,46,0.55)] aspect-[9/16]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#072f22] via-[#041912] to-[#010705]" aria-hidden />
              <div className="absolute -inset-8 bg-[radial-gradient(circle_at_top,#29ffb6_0%,rgba(10,44,32,0)_65%)] opacity-30" aria-hidden />
              <div className="relative flex h-full w-full items-center justify-center">
                <Loading
                  compact
                  title="Rendering video…"
                  subtitle="🤖 *beep boop* rumor mill spinning up"
                />
              </div>
            </div>
          ) : null}

          {!pending && inputProps ? (
            <div className="overflow-hidden rounded-[28px] shadow-[0_35px_110px_rgba(0,0,0,0.55)] border border-[#124c38] mb-12 mt-8 aspect-[9/16]">
              <Player
                component={Main}
                inputProps={inputProps}
                durationInFrames={DURATION_IN_FRAMES}
                fps={COMPOSITION_FPS}
                compositionHeight={COMPOSITION_HEIGHT}
                compositionWidth={COMPOSITION_WIDTH}
                style={{ width: "100%", height: "100%" }}
                controls
                autoPlay
                loop
              />
            </div>
          ) : null}

          {!pending && !inputProps ? (
            <div className="relative overflow-hidden rounded-[28px] border border-dashed border-[#1c5f47] bg-[#03120d] mb-12 mt-8 aspect-[9/16] flex items-center justify-center text-center px-6">
              <div>
                <p className="tbpn-headline text-xl text-white">No reel yet</p>
                <p className="mt-3 text-sm text-[#6fdab2]">
                  Fill in the rumor form and smash “Spin the rumor reel” to generate a preview.
                </p>
              </div>
            </div>
          ) : null}
        </div>
        {inputProps ? (
          <RenderControls inputProps={inputProps} />
        ) : null}
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
      </div>
    </div>
  );
}
