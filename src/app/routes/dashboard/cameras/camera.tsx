import { Box, Button, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface CameraRouteProps {
    title: string;
}

export function CameraRoute(props: CameraRouteProps) {
    const streamUrl = "http://192.168.1.131:8080?action=stream";
    const { t } = useTranslation();

    return (
        <Box>
            <Button mt={2} mb={4} onClick={() => window.history.back()}>{t("go_back")}</Button>
            <Heading size="lg">{props.title}</Heading>

            <Box
                borderRadius="md"
                h="80vh"
            >
                <img
                    src={streamUrl}
                    alt={`${props.title} feed`}
                    style={{
                        borderRadius: "8px",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>
        </Box>
    );
}
