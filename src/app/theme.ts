import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
    theme: {
        tokens: {
            colors: {
                brand: {
                    50: { value: "#ffe5e5" },
                    100: { value: "#ffc2c2" },
                    200: { value: "#ff9999" },
                    300: { value: "#ff7070" },
                    400: { value: "#ff4d4d" },
                    500: { value: "#e84545" },
                    600: { value: "#cc3d3d" },
                    700: { value: "#b23535" },
                    800: { value: "#992d2d" },
                    900: { value: "#661e1e" },
                },
            },
        },
    },
});

export const theme = createSystem(defaultConfig, customConfig);
