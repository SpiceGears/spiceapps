import type { NextConfig } from "next";

interface WatchOptions {
  poll: number;
  aggregateTimeout: number;
}

interface WebpackDevMiddlewareConfig {
  watchOptions?: WatchOptions;
  [key: string]: any;
}

const nextConfig: NextConfig = {
  webpackDevMiddleware: (config: WebpackDevMiddlewareConfig): WebpackDevMiddlewareConfig => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
