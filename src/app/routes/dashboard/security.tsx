import {Box, Button, Flex, Grid, Heading} from "@chakra-ui/react";
import {Camera} from "@/components/ui/camera.tsx";
import {useColorModeValue} from "@/components/ui/color-mode.tsx";

export function SecurityRoute() {
    const liveColor = useColorModeValue("red.500", "red.300");

    const cameraFeeds = [
        {id: 1, topic: "/camera/office/front_door/video", title: "Camera 1"},
        {id: 2, topic: "/camera/office/desks/video", title: "Camera 2"},
    ];

    return (
        <Box minH="100vh" p={4}>
            {/* Header */}
            <Flex justify="space-between" align="center" mb={4}>
                <Heading size="lg">Security Dashboard</Heading>
            </Flex>

            {/* Live Feed Section */}
            <Grid templateColumns={{base: "1fr", md: "1fr 1fr"}} gap={4}>
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

            {/* Camera Controls */}
            <Flex mt={4} gap={2}>
                {cameraFeeds.map((camera) => (
                    <Button key={camera.id}>
                        {camera.title}
                    </Button>
                ))}
                <Button>Capture</Button>
            </Flex>
        </Box>
    );
}
