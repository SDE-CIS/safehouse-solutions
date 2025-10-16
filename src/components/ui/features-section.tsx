import {Box, Flex, Icon, Text} from '@chakra-ui/react';
import {ReactNode} from "react";
import {useColorModeValue} from "@/components/ui/color-mode.tsx";

type Feature = {
    icon: ReactNode;
    title: string;
    text: string;
};

type FeaturesSectionProps = {
    features: Feature[];
};

export function FeaturesSection({features}: FeaturesSectionProps): JSX.Element {
    const bgColor = useColorModeValue('gray.50', 'black');

    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            bg={bgColor}
            py={10}
            px={4}
            gap={10}
            wrap="wrap"
        >
            {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    text={feature.text}
                />
            ))}
        </Flex>
    );
}

type FeatureCardProps = {
    icon: ReactNode;
    title: string;
    text: string;
};

export function FeatureCard({icon, title, text}: FeatureCardProps): JSX.Element {
    const bgColor = useColorModeValue('white', 'gray.900');
    const textColor = useColorModeValue('gray.900', 'white');

    return (
        <Box
            textAlign="center"
            maxW="300px"
            minH="300px"
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            transition="all 0.3s ease"
            _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'md',
            }}
        >
            <Icon boxSize={12} mb={4} color="brand.600">
                {icon}
            </Icon>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
                {title}
            </Text>
            <Text fontSize="md" color={textColor}>
                {text}
            </Text>
        </Box>
    );
}
