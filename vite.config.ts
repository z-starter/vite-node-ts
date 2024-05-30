import { defineConfig } from "vite"
import swc from "@z-code/vite-plugin-swc"
import { nodeExternals } from "rollup-plugin-node-externals"
import path from "path"
import { cpSync, readFileSync, writeFileSync } from "fs"

export default defineConfig({
  build: {
    lib: {
      name: "create-make",
      entry: [path.resolve(__dirname, "./src/main.ts")],
      fileName: (format, name) => {
        if (format === "es") return `${name}.js`
        else return `${name}.${format}`
      },
      formats: ["es"],
    },
  },
  plugins: [
    nodeExternals(),
    swc(),
    {
      name: "assets-config",
      closeBundle: async () => {
        cpSync(`${__dirname}/statics`, `${__dirname}/dist/statics`, {
          recursive: true,
        })

        const { devDependencies, packageManager, ...packageJson } = JSON.parse(
          readFileSync(`${__dirname}/package.json`, "utf8"),
        )

        packageJson.scripts = { start: "node main.js" }
        writeFileSync(
          `${__dirname}/dist/package.json`,
          JSON.stringify(packageJson, null, 2),
        )
      },
    },
  ],
})
