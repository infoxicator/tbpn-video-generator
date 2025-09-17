import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./video-news.tsx"),
  route("/image-uploader", "./image-uploader.tsx"),
  route("/sample", "./video-news-sample.tsx"),
  route("/mcp-ui-renderer", "./mcp-ui-renderer.tsx"),
  route("/api/lambda/progress", "./progress.tsx"),
  route("/api/lambda/render", "./render.tsx"),
] satisfies RouteConfig;
