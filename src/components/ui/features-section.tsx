import { Box, Icon, Text, Flex, SimpleGrid } from "@chakra-ui/react";
import { ReactNode } from "react";
// (keep your useColorModeValue import if you use it)

type Feature = { icon: ReactNode; title: string; text: string };
type FeaturesSectionProps = { features: Feature[] };

export function FeaturesSection({ features }: FeaturesSectionProps) {
    return (
        <SimpleGrid
            w="full"
            columns={{ base: 1, md: 3 }}
            gap={{ base: 4, md: 6 }}
        >
            {features.map((f, i) => (
                <FeatureCard key={i} icon={f.icon} title={f.title} text={f.text} />
            ))}
        </SimpleGrid>
    );
}

type FeatureCardProps = { icon: ReactNode; title: string; text: string };

export function FeatureCard({ icon, title, text }: FeatureCardProps) {
    return (
        <Box
            w="full"
            h="100%"
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="md"
            bg="blackAlpha.500"
            textAlign="center"
            transition="transform 0.2s ease, box-shadow 0.2s ease"
            _hover={{ transform: { base: "none", md: "scale(1.03)" }, boxShadow: "lg" }}
        >
            <Icon boxSize={{ base: 10, md: 12 }} color="white" mb={{ base: 3, md: 4 }}>
                {icon}
            </Icon>
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={{ base: 1, md: 2 }} color="white">
                {title}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="whiteAlpha.900">
                {text}
            </Text>
        </Box>
    );
}
