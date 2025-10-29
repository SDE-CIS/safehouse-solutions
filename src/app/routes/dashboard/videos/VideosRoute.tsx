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

export function VideosRoute() {
    const { data, isLoading, error } = useVideosQuery();
    const navigate = useNavigate();

    return (
        <Container maxW="container.xl" py={10}>
            <Heading size="2xl" textAlign="center" mb={8}>
                Video Archive
            </Heading>

            {isLoading ? (
                <Box textAlign="center" py={16}>
                    <Spinner size="xl" />
                    <Text mt={4}>Loading videos...</Text>
                </Box>
            ) : error ? (
                <Text textAlign="center" color="red.500">
                    Failed to load videos.
                </Text>
            ) : data && data.data.length > 0 ? (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={8}>
                    {data.data.map((video) => (
                        <Card.Root
                            key={video.name}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            overflow="hidden"
                            bg="white"
                            transition="all 0.25s ease"
                            _hover={{
                                transform: "translateY(-8px)",
                                boxShadow: "xl",
                                borderColor: "blue.300",
                            }}
                            cursor="pointer"
                            onClick={() => navigate(`/dashboard/videos/${encodeURIComponent(video.name)}`)}
                        >
                            <Box position="relative" aspectRatio={16 / 9} bg="gray.100">
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
                                />
                            </Box>

                            <Card.Body textAlign="center" py={4} gap={2}>
                                <Text fontWeight="medium" maxLines={2}>
                                    {video.name}
                                </Text>
                                <Button
                                    leftIcon={<FaPlay />}
                                    colorScheme="blue"
                                    variantStyle="filled"
                                    size="sm"
                                    mt={2}
                                >
                                    Watch
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
