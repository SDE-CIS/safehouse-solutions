import { Box, Button, Flex, Grid, Heading } from "@chakra-ui/react";
import { Camera } from "@/components/ui/camera.tsx";
import { useColorModeValue } from "@/components/ui/color-mode.tsx";
import { useTranslation } from "react-i18next";

export function CamerasRoute() {
    const liveColor = useColorModeValue("red.500", "red.300")
    const { t } = useTranslation();

    const cameraFeeds = [
        { id: 1, topic: "/camera/office/front_door/video", title: "Stue kamera" },
        { id: 2, topic: "/camera/office/desks/video", title: "Kontor kamera" },
    ];

    return (
        <Box minH="100vh" p={4}>
            {/* Header */}
            <Flex justify="space-between" align="center" mb={4}>
                <Heading size="lg">{t('cameras.overview')}</Heading>
            </Flex>

            {/* Live Feed Section */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
                {cameraFeeds.map((camera) => (
                    <Camera
                        key={camera.id}
                        cameraId={camera.id}
                        topic={camera.topic}
                        title={camera.title}
                        liveColor={liveColor}
                    />
                ))}
            </Grid>
        </Box>
    );
}
