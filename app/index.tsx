import { Player } from "@remotion/player";
import { Link } from "react-router-dom";
import { Main } from "~/remotion/components/Main";
import sampleResponse from "~/remotion/components/Sample/response.json";
import { StoryResponse } from "~/remotion/schemata";
import type { StoryData } from "~/remotion/types";
import {
  DURATION_IN_FRAMES,
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
} from "~/remotion/constants.mjs";
import { themes } from "~/features/news-generator/themes";
import "./app.css";

type MenuItem = {
  path: string;
  title: string;
  description: string;
  themeKey: keyof typeof themes;
};

const MENU_ITEMS: MenuItem[] = [
  {
    path: "/funding-news",
    title: "Funding News",
    description: "Break the latest raise with founder, round, and lead investor callouts.",
    themeKey: "funding",
  },
  {
    path: "/beef-update",
    title: "Beef Update",
    description: "Deploy the drama desk package for simmering rivalries and ceasefires.",
    themeKey: "breaking",
  },
  {
    path: "/poached",
    title: "Personnel News",
    description: "Showcase who just got scooped with the neon personnel treatment.",
    themeKey: "cobalt",
  },
  {
    path: "/signed",
    title: "Signed",
    description: "Announce fresh contracts with a broadcast-ready signing card.",
    themeKey: "signed",
  },
  {
    path: "/traded",
    title: "Trade Desk",
    description: "Spin up the TBPN trade breakdown with custom beats and assets.",
    themeKey: "emerald",
  },
  {
    path: "/new-profile-pic",
    title: "Profile Pic Drop",
    description: "Reveal a refreshed headshot with the spotlight-style profile package.",
    themeKey: "profile",
  },
];

export default function IndexRoute() {
  const previewData = sampleResponse as StoryData;

  return (
    <div className="bg-[#05060d] min-h-screen text-white pb-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
        <header className="relative py-16 space-y-4 text-center md:text-left">
          <img
            src="/tbpn-logo.png"
            alt="TBPN logo"
            className="absolute right-0 top-6 h-14 w-auto md:right-8 md:top-6"
          />
          <p className="tbpn-chip inline-flex">TBPN Generator Hub</p>
          <h1 className="tbpn-headline text-4xl md:text-5xl text-white">Pick a newsroom template</h1>
          <p className="text-[#c1fbe3] max-w-3xl mx-auto md:mx-0">
            Choose a storyline type to auto-populate the video generator with the right look and feel.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3 pb-16">
          {MENU_ITEMS.map(({ path, title, description, themeKey }) => {
            const theme = themes[themeKey];
            return (
              <Link
                key={path}
                to={path}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[#7afbd0] focus-visible:ring-offset-[#05060d] rounded-[32px]"
              >
            <article
              className={`${theme.panelClassName} transition-transform duration-300 rounded-[32px] px-7 py-8 flex flex-col gap-6 h-full border border-transparent group-hover:border-white/20 group-hover:-translate-y-1`}
            >
                  <div className="space-y-2">
                    <h2 className="tbpn-headline text-2xl text-white">{title}</h2>
                    <p className="text-sm leading-relaxed text-[#d7defc]">{description}</p>
                  </div>

                  <div
                    className={`relative overflow-hidden rounded-[24px] aspect-[9/16] ${theme.playerFrameClassName}`}
                  >
                    <Player
                      component={Main}
                      inputProps={{ ...previewData, theme: theme.video }}
                      durationInFrames={DURATION_IN_FRAMES}
                      fps={COMPOSITION_FPS}
                      compositionHeight={COMPOSITION_HEIGHT}
                      compositionWidth={COMPOSITION_WIDTH}
                      style={{ width: "100%", height: "100%" }}
                      controls
                      loop
                      autoPlay
                      muted
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs uppercase tracking-[0.32em] text-[#dfe6ff]">
                    <span>Open generator</span>
                    <span className="text-base">→</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
