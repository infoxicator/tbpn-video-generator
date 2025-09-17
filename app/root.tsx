import {
  Links,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "TBPN Rumor Reel Generator",
    },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { property: "og:title", content: "TBPN Rumor Reel Generator" },
    {
      name: "description",
      content:
        "Spin up TBPN-style rumor reels instantly. Upload a headshot, set the destination, and download the broadcast-ready video.",
    },
  ];
};

export const links: LinksFunction = () => [
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "/tbpn-favicon.svg",
  },
  {
    rel: "apple-touch-icon",
    href: "/tbpn-favicon.svg",
  },
];
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="mt-14">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
