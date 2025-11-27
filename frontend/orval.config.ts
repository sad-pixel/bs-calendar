import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "http://localhost:8000/openapi.json",
    output: {
      // It's a good practice to store generated files in a separate folder.
      // The .ts extension is important.
      target: "./src/lib/api/endpoints.ts",
      client: "react-query",
      override: {
        mutator: {
          // This points orval to our custom axios instance.
          path: "./src/lib/axios.ts",
          name: "api", // Use the default export from the mutator file.
        },
      },
    },
    hooks: {
      // This will format the generated file with prettier.
      afterAllFilesWrite: "prettier --write",
    },
  },
});
