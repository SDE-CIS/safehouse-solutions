import { Box, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react';
import { ReactNode } from "react";
import { useColorModeValue } from "@/components/ui/color-mode.tsx";

type Feature = {
    icon: ReactNode;
    title: string;
    text: string;
};

type FeaturesSectionProps = {
    features: Feature[];
};

export function FeaturesSection({ features }: FeaturesSectionProps): JSX.Element {
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap="6" display="flex" justifyContent="space-between">
            {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    text={feature.text}
                />
            ))}
        </Grid>
    );
}

type FeatureCardProps = {
    icon: ReactNode;
    title: string;
    text: string;
};

export function FeatureCard({ icon, title, text }: FeatureCardProps): JSX.Element {
    return (
        <GridItem
            textAlign="center"
            maxW="300px"
            minH="300px"
            transition="all 0.3s ease"
            _hover={{
                transform: 'scale(1.05)',
            }}
        >
            <Icon boxSize={12} color="white">
                {icon}
            </Icon>
            <Text fontSize="xl" fontWeight="bold" mb={2} color="white">
                {title}
            </Text>
            <Text fontSize="md" color="white">
                {text}
            </Text>
        </GridItem>
    );
}
