import configBuilder from "@pixi-v8-patch-spine/rollup-config";
import pkg from "./package.json" assert { type: "json" };

export default configBuilder(pkg.extensionConfig, pkg);