import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
    theme: {
        tokens: {
            colors: {
                brand: {
                    50: { value: "#f2f0ff" },
                    100: { value: "#d9d4ff" },
                    200: { value: "#bfb7ff" },
                    300: { value: "#a39aff" },
                    400: { value: "#876dff" },
                    500: { value: "#7753fb" },
                    600: { value: "#6747e0" },
                    700: { value: "#5439b3" },
                    800: { value: "#412b80" },
                    900: { value: "#2a1b4d" },
                },
            },
        },
    },
});

export const theme = createSystem(defaultConfig, customConfig);
