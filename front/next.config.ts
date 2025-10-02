import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // 开启静态导出模式
    output: 'export',

    // 如果项目中用了 <Image />，必须关闭优化，不然会报错
    images: {
      unoptimized: true,
    },
  eslint: {
    // ⚠️ 注意：这样会在 build 时忽略所有 ESLint 错误
    ignoreDuringBuilds: true,
  },
  headers() {
    // Required by FHEVM 
    return Promise.resolve([
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]);
  }
};

export default nextConfig;
