import { useEffect, useState } from "react";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { FeaturesSection } from "./features-section";
import { BannerProps } from "@/types/banner";

export function Banner({
    imageUrl,
    title,
    description,
    extraText,
    features,
    overlayColor = "rgba(0, 0, 0, 0)",
    size = "sm",
    typing = false,
}: BannerProps) {
    // Keep your desired target heights for larger screens
    const targetMinH =
        {
            sm: "50vh",
            md: "75vh",
            lg: "100vh",
        }[size] ?? "75vh";

    const [typedText, setTypedText] = useState("");
    const typingSpeed = 100;

    useEffect(() => {
        if (!typing || !description) {
            setTypedText(description ?? "");
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(description.slice(0, i + 1));
            i++;
            if (i === description.length) clearInterval(interval);
        }, typingSpeed);
        return () => clearInterval(interval);
    }, [typing, description]);

    return (
        <Box
            position="relative"
            w="100%"
            // Let content define height on mobile; only enforce a viewport min-height on md+
            minH={{ base: "auto", md: targetMinH }}
            // Give breathing room on mobile where we’re not forcing the height
            py={{ base: 8, md: 12 }}
            overflow="hidden"
        >
            {/* Background Image + Overlay */}
            <Box
                position="absolute"
                inset="0"
                bgImage={`url(${imageUrl})`}
                bgSize="cover"
                bgPos="center"
                bgRepeat="no-repeat"
                _before={{
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    bg: overlayColor,
                }}
                zIndex={0}
            />

            <Container
                maxW="container.xl"
                // Column flow so text sits above features and stacks naturally
                display="flex"
                flexDir="column"
                // On md+ we still want at least the target min-height
                minH={{ base: "auto", md: targetMinH }}
                position="relative"
                zIndex={1}
                px={{ base: 4, md: 6 }}
            >
                {/* Text block: auto height on mobile, vertically centered on md+ */}
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent={{ base: "flex-start", md: "center" }}
                    // Don’t cap with percentages; let it grow as needed. On md+ it’ll fill available space.
                    flex={{ base: "none", md: 1 }}
                    color="white"
                >
                    <Heading
                        as="h1"
                        // Responsive typography
                        fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                        lineHeight={{ base: "1.15", md: "1.1" }}
                        fontWeight="bold"
                        mb={{ base: 3, md: 4 }}
                        maxW={{ base: "100%", md: "760px" }}
                    >
                        {title}
                    </Heading>

                    <Box position="relative" maxW={{ base: "100%", md: "620px" }}>
                        {/* Invisible “measurer” preserves layout height while typing */}
                        <Text
                            fontSize={{ base: "md", sm: "lg", md: "2xl" }}
                            whiteSpace="pre-line"
                            opacity={0}
                            pointerEvents="none"
                        >
                            {description}
                        </Text>
                        <Text
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            fontSize={{ base: "md", sm: "lg", md: "2xl" }}
                            whiteSpace="pre-line"
                        >
                            {typedText}
                        </Text>
                    </Box>

                    {extraText && (
                        <Text
                            fontSize={{ base: "sm", sm: "md", md: "lg" }}
                            mt={{ base: 2, md: 3 }}
                            maxW={{ base: "100%", md: "620px" }}
                            opacity={0.9}
                            whiteSpace="pre-line"
                        >
                            {extraText}
                        </Text>
                    )}
                </Box>

                {/* Features sit below text; stack on mobile via SimpleGrid inside */}
                {features && (
                    <Box mt={{ base: 6, md: 10 }} mb={{ base: 0, md: 2 }}>
                        <FeaturesSection features={features} />
                    </Box>
                )}
            </Container>
        </Box>
    );
}
