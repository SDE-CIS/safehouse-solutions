import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Card,
    Spinner,
} from "@chakra-ui/react";
import { useVideosQuery } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaVideo } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function VideosRoute() {
    const { data, isLoading, error } = useVideosQuery();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Container maxW="container.xl" py={10}>
            <Heading size="2xl" textAlign="center" mb={8}>
                {t("videos.archive")}
            </Heading>

            {isLoading ? (
                <Box textAlign="center" py={16}>
                    <Spinner size="xl" />
                    <Text mt={4}>{t("videos.loading")}</Text>
                </Box>
            ) : error ? (
                <Text textAlign="center" color="red.500">
                    {t("videos.error")}
                </Text>
            ) : data && data.data.length > 0 ? (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={8}>
                    {data.data.map((video) => (
                        <Card.Root
                            key={video.name}
                            borderRadius="xl"
                            overflow="hidden"
                            transition="all 0.25s ease"
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "xl",
                                borderColor: "brand.300",
                            }}
                            cursor="pointer"
                            onClick={() => navigate(`/dashboard/videos/${encodeURIComponent(video.name)}`)}
                        >
                            <Box position="relative" aspectRatio={16 / 9} bg="gray.100">
                                {video.thumbnail ? (
                                    <img
                                        src={video.thumbnail}
                                        alt={video.name}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <FaVideo
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontSize: "3rem",
                                            color: "#3182CE",
                                            opacity: 0.8,
                                        }}
                                    />)}
                            </Box>

                            <Card.Body textAlign="center" py={4} gap={2}>
                                <Text fontWeight="medium" maxLines={2}>
                                    {video.name}
                                </Text>
                                <Button
                                    leftIcon={<FaPlay />}
                                    colorScheme="brand"
                                    variantStyle="filled"
                                    size="sm"
                                    mt={2}
                                >
                                    {t("videos.watch")}
                                </Button>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </SimpleGrid>
            ) : (
                <Text textAlign="center">No videos found.</Text>
            )}
        </Container>
    );
}
