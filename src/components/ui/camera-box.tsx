import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface CameraFeedProps {
    title: string;
    liveColor: string;
    height?: string;
}

export function CameraBox({ title, liveColor, height }: CameraFeedProps) {
    const streamUrl = "http://192.168.1.131:8080?action=stream";

    return (
        <Box p={4} borderRadius="md" shadow="md">
            <Heading size="lg">{title}</Heading>
            <Text color="gray.500">MJPEG Stream</Text>

            <Box
                bg="black"
                borderRadius="md"
                h={height || "350px"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={3}
                overflow="hidden"
            >
                <img
                    src={streamUrl}
                    alt={`${title} feed`}
                    style={{
                        borderRadius: "8px",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>

            {/* Live Indicator */}
            <Flex justifyContent="space-between">
                <Text mt={2} fontWeight="bold" color={liveColor}>
                    ● Live
                </Text>
            </Flex>
        </Box>
    );
}
