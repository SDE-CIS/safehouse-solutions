import { useState, useEffect } from "react";
import {
    Box,
    Image,
    IconButton,
    Flex,
    Text,
    Heading,
    Stack,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Slide {
    src: string;
    alt: string;
    title?: string;
    description?: string;
}

interface SlideshowProps {
    slides: Slide[];
}

export function Slideshow({ slides }: SlideshowProps) {
    const [current, setCurrent] = useState(0);

    const nextSlide = () =>
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

    const prevSlide = () =>
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    const slide = slides[current];

    return (
        <Box
            position="relative"
            w="100%"
            maxW="1200px"
            mx="auto"
            p={6}
        >
            <Flex
                direction={["column", "column", "row"]}
                align="center"
                justify="space-between"
                gap={8}
            >
                <Box w={["100%", "100%", "50%"]}>
                    <Stack gap={4}>
                        <Heading size="2xl">{slide.title}</Heading>
                        <Text fontSize="lg" opacity={0.9}>
                            {slide.description}
                        </Text>
                    </Stack>
                </Box>

                <Box w={["100%", "100%", "50%"]}>
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        w="100%"
                        h={["auto", "auto", "400px"]}
                        minHeight="250px"
                        objectFit="cover"
                        borderRadius="md"
                    />
                </Box>
            </Flex>

            <Flex
                justify="space-between"
                align="center"
                position="relative"
                top="93%"
                w="50%"
                margin="0 auto"
                paddingTop="2rem"
            >
                <IconButton
                    aria-label="Previous"
                    onClick={prevSlide}
                    variant="ghost"
                    size="lg"
                ><FaChevronLeft />
                </IconButton>
                <IconButton
                    aria-label="Next"
                    onClick={nextSlide}
                    variant="ghost"
                    size="lg"
                ><FaChevronRight />
                </IconButton>
            </Flex>
        </Box>
    );
}
