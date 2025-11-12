import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useBufferImage } from "@/hooks/useBufferImage";
import { Detection } from "@/types/Detection";

const MotionBox = motion(Box);

interface CameraDetectionCardProps {
    detection: Detection;
    fanCardBg: string;
    t: (key: string) => string;
}

export function CameraDetectionView({
    detection,
    fanCardBg,
    t,
}: CameraDetectionCardProps) {
    const imageSrc = useBufferImage(detection.CameraImage);

    return (
        <MotionBox
            key={detection.ID}
            borderWidth="1px"
            borderRadius="lg"
            p={5}
            bg={fanCardBg}
            shadow="sm"
            whileHover={{ y: -5, boxShadow: "xl" }}
            transition={{ duration: 0.2 }}
        >
            <VStack align="start" gap={2}>
                <Text fontWeight="bold">Detection #{detection.ID}</Text>
                <Text fontSize="sm">
                    <strong>{t("timestamp")}:</strong>{" "}
                    {detection.ImageTimestamp
                        ? new Date(detection.ImageTimestamp).toLocaleString()
                        : t("no_timestamp")}
                </Text>

                {imageSrc ? (
                    <Box mt={3} w="100%">
                        <img
                            src={imageSrc}
                            alt={`Detection ${detection.ID}`}
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                objectFit: "cover",
                                maxHeight: "200px",
                            }}
                        />
                    </Box>
                ) : (
                    <Text fontSize="sm" color="gray.500">
                        {t("no_image_available")}
                    </Text>
                )}
            </VStack>
        </MotionBox>
    );
}
