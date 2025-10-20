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
      title: "TBPN Video Generator",
    },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { property: "og:title", content: "TBPN Video Generator" },
    {
      name: "description",
      content:
        "Produce TBPN-style videos instantly. Upload a headshot and download a broadcast-ready video.",
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
