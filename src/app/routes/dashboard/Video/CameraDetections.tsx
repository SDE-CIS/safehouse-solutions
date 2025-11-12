import {
    Container,
    Heading,
    SimpleGrid,
    Spinner,
    Text,
    Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCameraDetectionsQuery } from "@/services/api";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Cookies } from "react-cookie";
import { CameraDetectionView } from "../DetectionView";
import { Button } from "@/components/ui/button";

const cookies = new Cookies();

export function CameraDetectionsRoute() {
    const userId = cookies.get("id");
    const { t } = useTranslation();

    // Pagination state
    const [page, setPage] = useState(1);
    const limit = 6; // detections per page

    // Fetch camera detections
    const { data, isLoading, isError, refetch } = useCameraDetectionsQuery({
        id: userId,
        page,
        limit,
    });

    const fanCardBg = useColorModeValue("white", "gray.900");
    const pagination = data?.pagination;
    const detections = data?.data ?? [];

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="xl" mb={8} textAlign="center">
                {t("camera_detections")}
            </Heading>

            {isLoading ? (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="lg" />
                </Flex>
            ) : isError ? (
                <Text color="red.500" textAlign="center">
                    {t("failed_to_load_detections")}
                </Text>
            ) : detections.length === 0 ? (
                <Text color="gray.500" textAlign="center">
                    {t("no_camera_detections")}
                </Text>
            ) : (
                <>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
                        {detections.map((detection) => (
                            <CameraDetectionView
                                key={detection.ID}
                                detection={detection}
                                fanCardBg={fanCardBg}
                                t={t}
                            />
                        ))}
                    </SimpleGrid>

                    {/* PAGINATION */}
                    <Flex justify="center" align="center" mt={10} gap={4}>
                        <Button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={!pagination?.hasPrevPage}
                        >
                            {t("previous")}
                        </Button>

                        <Text fontSize="sm">
                            {t("page")} {pagination?.currentPage ?? page} /{" "}
                            {pagination?.totalPages ?? "?"}
                        </Text>

                        <Button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!pagination?.hasNextPage}
                        >
                            {t("next")}
                        </Button>

                        <Button variantStyle="outline" onClick={() => refetch()}>
                            {t("refresh")}
                        </Button>
                    </Flex>
                </>
            )}
        </Container>
    );
}
