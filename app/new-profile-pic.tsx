import type { GeneratorLoaderData } from "~/features/news-generator/types";
import { clientLoader } from "~/features/news-generator/loader";
import { createHydrateFallback, NewsGeneratorPage } from "~/features/news-generator/NewsGeneratorPage";
import { profileTheme } from "~/features/news-generator/themes";
import "./app.css";

export { clientLoader };

export const HydrateFallback = createHydrateFallback(profileTheme);

export default function NewProfilePicRoute({ loaderData }: { loaderData: GeneratorLoaderData }) {
  return <NewsGeneratorPage loaderData={loaderData} theme={profileTheme} />;
}
