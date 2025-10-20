import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./index.tsx"),
  route("/image-uploader", "./image-uploader.tsx"),
  route("/beef-update", "./beef-update.tsx"),
  route("/traded", "./video-news.tsx"),
  route("/poached", "./poached-news.tsx"),
  route("/signed", "./signed-news.tsx"),
  route("/funding-news", "./funding-news.tsx"),
  route("/new-profile-pic", "./new-profile-pic.tsx"),
  route("/sample", "./video-news-sample.tsx"),
  route("/mcp-ui-renderer", "./mcp-ui-renderer.tsx"),
  route("/api/lambda/progress", "./progress.tsx"),
  route("/api/lambda/render", "./render.tsx"),
  route("/api/story-shares", "./api.story-shares.tsx"),
  route("/share/:shareId", "./share-player.tsx"),
] satisfies RouteConfig;
