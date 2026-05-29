// Vercel serverless entry point.
// The actual NestJS app is compiled by `nest build` into ../dist/serverless.js.
// Building with tsc (not esbuild) keeps the decorator metadata NestJS needs for DI.
// @ts-ignore - produced at build time by `npm run build`
export { default } from '../dist/serverless';
