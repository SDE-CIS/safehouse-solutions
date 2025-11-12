import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Card,
    Spinner,
    Select,
    VStack,
    createListCollection,
} from "@chakra-ui/react";
import { useVideosQuery } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaVideo } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

function parseDateFromName(name: string): Date | null {
    const match = name.match(/^(\d{2})_(\d{2})_(\d{4})_(\d{2})_(\d{2})_(\d{2})/);
    if (!match) return null;

    const [_, day, month, year, hour, minute, second] = match;
    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    );
}

export function VideosRoute() {
    const { data, isLoading, error } = useVideosQuery();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<string>("");

    const videos = data?.data ?? [];

    // ✅ Parse and sort videos by extracted date
    const videosWithParsedDates = useMemo(() => {
        return videos
            .map((video) => ({
                ...video,
                parsedDate: parseDateFromName(video.name),
            }))
            .filter((v) => v.parsedDate !== null)
            .sort(
                (a, b) =>
                    (b.parsedDate as Date).getTime() -
                    (a.parsedDate as Date).getTime()
            );
    }, [videos]);

    // ✅ Group by date (YYYY-MM-DD)
    const groupedByDate = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        videosWithParsedDates.forEach((video) => {
            const dateObj = video.parsedDate as Date;
            const dateKey = dateObj.toISOString().split("T")[0];
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(video);
        });
        return grouped;
    }, [videosWithParsedDates]);

    // ✅ Get all unique dates (sorted descending)
    const availableDates = useMemo(() => {
        return Object.keys(groupedByDate).sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
    }, [groupedByDate]);

    // ✅ Videos filtered by selected date
    const filteredVideos = selectedDate
        ? groupedByDate[selectedDate] ?? []
        : videosWithParsedDates;

    const dateCollection = createListCollection({
        items: availableDates.map((date) => ({
            value: date,
            label: new Date(date).toLocaleDateString(),
        })),
    });

    return (
        <Container maxW="container.xl" py={10}>
            <VStack gap={6}>
                <Heading size="2xl" textAlign="center">
                    {t("videos.archive")}
                </Heading>

                {availableDates.length > 0 && (
                    <Box w="full" maxW="300px">
                        <Select.Root
                            collection={dateCollection}
                            value={[selectedDate]}
                            onValueChange={(e) => setSelectedDate(e.value[0])}
                        >
                            <Select.Trigger>
                                <Select.ValueText>
                                    {selectedDate
                                        ? new Date(selectedDate).toLocaleDateString()
                                        : t("videos.select_date")}
                                </Select.ValueText>
                            </Select.Trigger>

                            <Select.Content position="absolute" w="300px">
                                {dateCollection.items.map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                        {item.label}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </Box>
                )}
            </VStack>

            {isLoading ? (
                <Box textAlign="center" py={16}>
                    <Spinner size="xl" />
                    <Text mt={4}>{t("videos.loading")}</Text>
                </Box>
            ) : error ? (
                <Text textAlign="center" color="red.500">
                    {t("videos.error")}
                </Text>
            ) : filteredVideos.length > 0 ? (
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    gap={8}
                    mt={8}
                >
                    {filteredVideos.map((video) => (
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
                            onClick={() =>
                                navigate(
                                    `/dashboard/videos/archive/${encodeURIComponent(video.name)}`
                                )
                            }
                        >
                            <Box
                                position="relative"
                                aspectRatio={16 / 9}
                                bg="gray.100"
                            >
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
                                            transform:
                                                "translate(-50%, -50%)",
                                            fontSize: "3rem",
                                            color: "#3182CE",
                                            opacity: 0.8,
                                        }}
                                    />
                                )}
                            </Box>

                            <Card.Body textAlign="center" py={4} gap={2}>
                                <Text fontWeight="medium" maxLines={2}>
                                    {video.name}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {video.parsedDate?.toLocaleString()}
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
                <Text textAlign="center" mt={10}>
                    {t("videos.none_found")}
                </Text>
            )}
        </Container>
    );
}
