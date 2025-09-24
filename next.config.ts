import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "no-unused-vars": "off",
  "prefer-const": ["warn", {
    "destructuring": "all", // Optionally, apply this rule to destructured variables
    "ignoreReadBeforeAssign": false
  }]
};

export default nextConfig;
