import { Box, Flex, Grid, Heading } from "@chakra-ui/react";
import { CameraBox } from "@/components/ui/camera-box";
import { useColorModeValue } from "@/components/ui/color-mode.tsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function CamerasRoute() {
    const liveColor = useColorModeValue("red.500", "red.300")
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cameraFeeds = [
        { id: 1, topic: "/camera/office/front_door/video", title: "Stue kamera" },
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
                    <Box onClick={() => navigate(`/dashboard/cameras/${camera.id}`)}>
                        <CameraBox
                            key={camera.id}
                            title={camera.title}
                            liveColor={liveColor}
                        />
                    </Box>
                ))}
            </Grid>
        </Box>
    );
}
