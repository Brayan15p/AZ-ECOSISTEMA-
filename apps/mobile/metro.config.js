// Metro configurado para monorepo pnpm (apps/mobile dentro de AZ-ECOSISTEMA).
// Observa la raíz del workspace para resolver los paquetes @az/* (que exportan
// su `src/*.ts` directamente, sin build) y aplica NativeWind.
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Observa todo el monorepo (para los paquetes @az/*).
config.watchFolders = [workspaceRoot];

// 2. Resuelve módulos desde la app y desde la raíz (node-linker=hoisted).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
