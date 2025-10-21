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

const basePreviewImages = {
  hero: "https://images.iwasthere.today/combined-1758063844495-cfp5dy.png",
  neonNewsroom: "https://images.iwasthere.today/nikita-beef-settled.jpeg",
  studioBackdrop: "https://images.iwasthere.today/succession1.jpg",
  controlRoom: "https://images.iwasthere.today/blackmirror1.jpg",
  fundingNewsroom: "https://images.iwasthere.today/deel-raises-300.jpeg",
  poachedNewsroom: "https://images.iwasthere.today/andrew-poached.jpeg",
  signedNewsroom: "https://images.iwasthere.today/alex-signed.jpeg",
  tradeNewsroom: "https://images.iwasthere.today/traded-brent.png",
  profileNewsroom: "https://images.iwasthere.today/roelof-new-pfp.jpeg",
};

const previewDataByTheme: Record<MenuItem["themeKey"], StoryData> = {
  funding: {
    title:
      "BREAKING: Deel Raises Big Bucks from Rabbit Capital and A16Z, Valuation Now Measured in Moon Units",
    date: "2024-12-15T14:30:00Z",
    mainImage: basePreviewImages.fundingNewsroom,
    slides: [
      {
        image: basePreviewImages.fundingNewsroom,
        text: "In a shocking twist, Deel has just raised a funding round so massive, early employees reportedly tried to expense their existential crises. Rabbit Capital and A16Z now own enough of Deel to demand a company picnic on Mars.",
      },
      {
        image: basePreviewImages.fundingNewsroom,
        text: "Inside sources say the pitch deck featured 54 slides, 9 pie charts, and one hand-drawn unicorn. Investors didn’t understand the business model, but approved after hearing the phrase ‘AI-powered synergy’ at least twelve times.",
      },
      {
        image: basePreviewImages.fundingNewsroom,
        text: "Deel’s founders insist the new round will be spent ‘revolutionizing disruption’ and buying ergonomic beanbags. Analysts predict at least 6 pivots, 2 rebrands, and 14 new job titles no one's mother can explain.",
      },
      {
        image: basePreviewImages.fundingNewsroom,
        text: "Asked for comment, a spokesperson for Rabbit Capital stated, 'We believe in Deel’s vision to connect the world, or whatever it is they do.' Meanwhile, A16Z simply sent a GIF of a rocket ship and a winking emoji.",
      },
    ],
  },
  breaking: {
    title: "Beff Jezos Finally Buries the Hatchet with Nikita Bier—Literally",
    date: "2024-12-15T14:30:00Z",
    mainImage: basePreviewImages.neonNewsroom,
    slides: [
      {
        image: basePreviewImages.neonNewsroom,
        text: "In a shocking turn of events, Beff Jezos was spotted outside Nikita Bier HQ wielding a comically large olive branch, raising suspicions that the quarreling duo might be ending their legendary feud. Sources confirmed the branch was purchased on same-day delivery, naturally.",
      },
      {
        image: basePreviewImages.neonNewsroom,
        text: "Employees watched as Beff ceremoniously exchanged a peace contract for a lifetime supply of artisanal energy drinks—reportedly the only kind Biers serve at meetings. Negotiations stalled briefly when Beff demanded the company name be changed to 'Bierzon'.",
      },
      {
        image: basePreviewImages.neonNewsroom,
        text: "As a goodwill gesture, Nikita Bier presented Jezos with a personalized office plaque reading, 'World’s Most Ambitious Frenemy.' Beff responded by installing a vending machine that dispenses motivational quotes, cryptic emails, and maybe snacks if you’re lucky.",
      },
      {
        image: basePreviewImages.neonNewsroom,
        text: "Shares soared after a group selfie with forced smiles went viral. Analysts predict this truce will last until someone forgets to reply-all or moves the printer. For now, Silicon Alley sleeps easier—unless the vending machine malfunctions.",
      },
    ],
  },
  cobalt: {
    title:
      'BREAKING: "Andrew Tulloc" Traded to From Thinking Machines to Meta in Blockbuster Corporate Deal!',
    date: "2024-12-15T14:30:00Z",
    mainImage: basePreviewImages.poachedNewsroom,
    slides: [
      {
        image:
          basePreviewImages.poachedNewsroom,
        text: 'In a move even his coffee mug didn’t see coming, "Andrew Tulloc" has been traded from Thinking Machines to Meta. Water coolers everywhere are abuzz, and foam fingers are selling out in HR.',
      },
      {
        image:
          basePreviewImages.poachedNewsroom,
        text: 'Speculation is rampant: did Meta offer unlimited snacks, or just a better Wi-Fi password? Sources say Andrew’s manager at Thinking Machines is "devastated but optimistic for draft picks."',
      },
      {
        image:
          basePreviewImages.poachedNewsroom,
        text: "An anonymous insider claims, “We had to sweeten the deal with half a box of TimBits and the office plant.” Meta is said to be reconfiguring its seating chart in anticipation.",
      },
      {
        image:
          basePreviewImages.poachedNewsroom,
        text: 'Fans have already begun burning jerseys—okay, printing new nametags—while LinkedIn’s transfer rumor mill goes wild. When reached for comment, Andrew reportedly replied with, "Wait, what league am I in again?"',
      },
    ],
  },
  signed: {
    "title": "It’s Official: Alex Lupsasca Shakes Up Silicon Valley By Joining Open Ai!",
    "date": "2024-12-15T14:30:00Z",
    "mainImage": basePreviewImages.signedNewsroom,
    "slides": [
        {
            "image": basePreviewImages.signedNewsroom,
            "text": "Breaking news: In a move as seismic as a unicorn doing the cha-cha, Alex Lupsasca has catapulted into Open Ai’s galaxy—sending shockwaves through watercoolers, group chats, and even overly dramatic Slack channels."
        },
        {
            "image": basePreviewImages.signedNewsroom,
            "text": "Witnesses report confetti cannons were deployed, while competitive AI models sobbed pixelated tears. Open Ai CEO simply stated: 'We had no choice. The meme potential was too powerful to ignore.'"
        },
        {
            "image": basePreviewImages.signedNewsroom,
            "text": "Analysts predict stock prices may rise, office chair spin speeds may double, and coffee machines may finally become self-aware from sheer excitement. Residents are advised to expect pun surges citywide."
        },
        {
            "image": basePreviewImages.signedNewsroom,
            "text": "Stay tuned as Alex Lupsasca settles in: rumor has it, a celebratory algorithmic dance-off and spontaneous motivational haiku contest are already on the onboarding calendar. The future looks delightfully unpredictable!"
        }
    ]
},
  emerald: {
    "title": "BREAKING: Bret Liang Disrupts A16Z, Coffee Stocks Plunge",
    "date": "2024-12-15T14:30:00Z",
    "mainImage": basePreviewImages.tradeNewsroom,
    "slides": [
        {
            "image": basePreviewImages.tradeNewsroom,
            "text": "Start-up HQs across the Valley reported seismic activity as Bret Liang's onboarding email hit the A16Z servers. \"It was either him or AI overlords,\" said one shaken intern clutching kombucha."
        },
        {
            "image": basePreviewImages.tradeNewsroom,
            "text": "In his first hour, Bret created five Slack channels, two DAOs, and a mysterious folder labeled ‘Project Unicorn’—which promptly crashed every office printer from over-excitement."
        },
        {
            "image": basePreviewImages.tradeNewsroom,
            "text": "When asked about game-changing strategies, Bret replied, \"I plan to replace all meetings with interpretive dance.\" Shareholders applauded, then nervously googled ‘business jazz hands’."
        },
        {
            "image": basePreviewImages.tradeNewsroom,
            "text": "Rumors swirl he's here to replace Marc Andreessen’s shoe collection with holograms. Bret denied comment, but his LinkedIn status: ‘Manifesting Chaos’ speaks volumes. Stay tuned—if you dare."
        }
    ]
  },
  profile:{
    "title": "BREAKING: Roelof Botha Updates Profile Pic, Twitter in Frenzy",
    "date": "2024-12-15T14:30:00Z",
    "mainImage": basePreviewImages.profileNewsroom,
    "slides": [
        {
            "image": basePreviewImages.profileNewsroom,
            "text": "BREAKING NEWS: Roelof Botha has shattered the internet by changing his profile picture on Twitter. Market analysts predict ‘an unprecedented wave of retweets.’ Chaos reported in several group chats."
        },
        {
            "image": basePreviewImages.profileNewsroom,
            "text": "A Twitter spokesperson said, “We haven’t seen this much excitement since someone accidentally tweeted ‘Good morning.’” Eyewitnesses claim the new pic “radiates at least 20% more gravitas.”"
        },
        {
            "image": basePreviewImages.profileNewsroom,
            "text": "Economists warn of a productivity slump as employees worldwide pause to analyze Roelof’s bold move. HR departments prepare emergency ‘profile picture etiquette’ seminars."
        },
        {
            "image": basePreviewImages.profileNewsroom,
            "text": "Public reactions are mixed: ‘Iconic,’ tweets one fan; ‘I’m updating mine in solidarity,’ vows another. Twitter HQ on high alert in case Roelof also updates his header image. Stay tuned!"
        }
    ]
}
};

export default function IndexRoute() {
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
            const previewData = previewDataByTheme[themeKey] ?? (sampleResponse as StoryData);
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
