import { VERSION } from "remotion";

export const COMPOSITION_FPS = 30;
export const DURATION_IN_FRAMES = 600; // ~20 seconds total: title + 4 slides + end frame
export const COMPOSITION_WIDTH = 1080;
export const COMPOSITION_HEIGHT = 1920;
export const COMPOSITION_ID = "LogoAnimation";
export const RAM = 3009;
export const DISK = 10240;
export const TIMEOUT = 240;
export const SITE_NAME = "remotion-react-router-example-" + VERSION;

/**
 * Use autocomplete to get a list of available regions.
 * @type {import('@remotion/lambda').AwsRegion}
 */
export const REGION = "us-east-1";
