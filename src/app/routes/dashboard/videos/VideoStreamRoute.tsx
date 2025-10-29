
import {
    Box,
    Container,
    Heading,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useVideoStreamQuery } from "@/services/api";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export function VideoStreamRoute() {
    const { filename } = useParams<{ filename: string }>();
    const navigate = useNavigate();
    const { data: blob, isFetching, error } = useVideoStreamQuery(filename!, {
        skip: !filename,
    });

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const isAvi = filename?.toLowerCase().endsWith(".avi");

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [blob]);

    return (
        <Container maxW="container.xl" py={10}>
            <Button
                leftIcon={<FaArrowLeft />}
                onClick={() => navigate("/dashboard/videos")}
                variantStyle="outline"
                mb={4}
            >
                Back to list
            </Button>

            <Heading size="lg" mb={6} textAlign="center" wordBreak="break-all">
                {filename}
            </Heading>

            {isFetching ? (
                <Box textAlign="center" py={16}>
                    <Spinner size="xl" />
                    <Text mt={4}>Loading video stream...</Text>
                </Box>
            ) : error ? (
                <Text textAlign="center" color="red.500">
                    Failed to load video.
                </Text>
            ) : videoUrl ? (
                isAvi ? (
                    <Box textAlign="center" >
                        <Text fontSize="lg" mb={4}>
                            This video format (.avi) is not supported for browser playback.
                        </Text>
                        <Button
                            as="a"
                            href={`${import.meta.env.VITE_API_BASE_URL}/videos/stream/${filename}`}
                            download
                            colorScheme="blue"
                        >
                            Download Video
                        </Button>
                    </Box>
                ) : (
                    <video
                        src={`${import.meta.env.VITE_API_BASE_URL}/videos/stream/${filename}`}
                        controls
                        autoPlay
                        style={{ width: "100%", maxHeight: "700px", borderRadius: "12px", objectFit: "cover" }}
                    />
                )
            ) : (
                <Text textAlign="center">No video found.</Text>
            )}
        </Container >
    );
}
