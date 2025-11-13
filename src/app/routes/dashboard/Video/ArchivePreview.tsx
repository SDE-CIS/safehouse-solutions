
import {
    Box,
    Container,
    Heading,
    Link,
    Text,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";

export function ArchivePreviewRoute() {
    const { filename } = useParams<{ filename: string }>();
    const navigate = useNavigate();

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const isAvi = filename?.toLowerCase().endsWith(".avi");
    const { t } = useTranslation();

    useEffect(() => {
        if (filename) {
            setVideoUrl(`${import.meta.env.VITE_API_BASE_URL}/videos/stream/${filename}`);
        }
    }, [filename]);

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

            {!videoUrl ? (
                <Text textAlign="center">{t("videos.no_video_found")}</Text>
            ) : isAvi ? (
                <Box textAlign="center">
                    <Text fontSize="lg" mb={4}>
                        {t("videos.avi_file")}
                    </Text>
                    <Link
                        href={videoUrl}
                        download
                    >
                        <Button leftIcon={<Download />} colorScheme="brand">
                            Download
                        </Button>
                    </Link>
                </Box>
            ) : (
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    style={{
                        width: "100%",
                        maxHeight: "700px",
                        borderRadius: "12px",
                        objectFit: "cover",
                    }}
                />
            )}
        </Container >
    );
}
