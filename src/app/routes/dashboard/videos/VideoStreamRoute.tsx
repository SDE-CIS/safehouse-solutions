
import {
    Box,
    Container,
    Heading,
    Link,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useVideoStreamQuery } from "@/services/api";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";

export function VideoStreamRoute() {
    const { filename } = useParams<{ filename: string }>();
    const navigate = useNavigate();
    const { data: blob, isFetching, error } = useVideoStreamQuery(filename!, {
        skip: !filename,
    });

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const isAvi = filename?.toLowerCase().endsWith(".avi");
    const { t } = useTranslation();

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
                onClick={() => navigate("/dashboard/videos/archive")}
                variantStyle="outline"
                mb={4}
            >

            </Button>

            <Heading size="lg" mb={6} textAlign="center" wordBreak="break-all">
                {filename}
            </Heading>

            {isFetching ? (
                <Box textAlign="center" py={16}>
                    <Spinner size="xl" />
                    <Text mt={4}>{t("videos.loading")}</Text>
                </Box>
            ) : error ? (
                <Text textAlign="center" color="red.500">
                    {t("videos.error")}
                </Text>
            ) : videoUrl ? (
                isAvi ? (
                    <Box textAlign="center" >
                        <Text fontSize="lg" mb={4}>
                            {t("videos.avi_file")}
                        </Text>
                        <Link href={`${import.meta.env.VITE_API_BASE_URL}/videos/stream/${filename}`} download>
                            <Button leftIcon={<Download />} colorScheme="brand">Download</Button>
                        </Link>
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
                <Text textAlign="center">{t("videos.no_video_found")}</Text>
            )}
        </Container >
    );
}
