import {Box, Flex, Heading, Spinner, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useMqtt} from "@/hooks/useMqtt"; // Import your custom MQTT hook

interface CameraFeedProps {
    cameraId: number;
    topic: string;
    title: string;
    liveColor: string;
}

export function Camera({ cameraId, topic, title, liveColor }: CameraFeedProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const { message: receivedImage, isConnected } = useMqtt({
        server: "10.130.54.49",
        port: 9001,
        username: "G7Christian",
        password: "SDECSC",
        clientId: `Dashboard-Camera-${cameraId}`,
        topic,
    });

    useEffect(() => {
        if (receivedImage && receivedImage.image) {
            const src = `data:image/jpeg;base64,${receivedImage.image}`;
            setImageSrc(src);
        }
    }, [receivedImage]);

    return (
        <Box p={4} borderRadius="md" shadow="md">
            <Heading size="md" mb={2} color="white">
                {title}
            </Heading>

            <Box
                bg="black"
                borderRadius="md"
                h="350px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={`${title} feed`}
                        style={{
                            borderRadius: "8px",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : isConnected ? (
                    <Spinner color="white" size="lg" />
                ) : (
                    <Text color="gray.500">No feed available</Text>
                )}
            </Box>

            {/* Live Indicator */}
            {isConnected && (
                <Flex justifyContent="space-between">
                    <Text mt={2} fontWeight="bold" color={liveColor}>
                        ● Live
                    </Text>
                    <Text mt={2} fontWeight="bold" color={receivedImage?.motion_detected ? "red.500" : ""}>
                        {receivedImage?.motion_detected ? "Motion detected!" : "No motion detected."}
                    </Text>
                </Flex>
            )}
        </Box>
    );
}
