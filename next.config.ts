import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 정적 사이트로 내보낸다. 이 페이지는 전부 클라이언트 상태로 동작하고
   * 서버 런타임이 필요 없어서, Cloudflare Pages 에 `out/` 을 그대로 올린다.
   */
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
