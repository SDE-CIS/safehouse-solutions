import { Box, Button, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export function LivePreviewRoute() {
    const streamUrl = "http://192.168.1.131:8080?action=stream";
    const { t } = useTranslation();

    return (
        <>
            <Button mt={2} mb={4} onClick={() => window.history.back()}>{t("go_back")}</Button>
            <Heading size="lg">{t("camera_feed")}</Heading>

            <Box
                borderRadius="md"
                h="80vh"
            >
                <img
                    src={streamUrl}
                    alt={`${t("camera_feed")} ${t("live")}`}
                    style={{
                        borderRadius: "8px",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>
        </>
    );
}
