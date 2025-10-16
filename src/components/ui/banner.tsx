import { BannerProps } from '@/types/banner';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { FeaturesSection } from './features-section';

export function Banner({
    imageUrl,
    title,
    description,
    extraText,
    features,
    overlayColor = 'rgba(0, 0, 0, 0)',
    size = 'sm',
}: BannerProps) {
    const height = {
        sm: '50vh',
        md: '75vh',
        lg: '100vh',
    }[size];

    return (
        <Box position="relative" width="100%" height={height} overflow="hidden">
            <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bgImage={`url(${imageUrl})`}
                bgSize="cover"
                bgPos="center"
                bgRepeat="no-repeat"
                zIndex="0"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    bg: overlayColor,
                    zIndex: '-1',
                }}
            />

            <Container maxW="container.xl" height="100%">
                <Box
                    position="relative"
                    zIndex="1"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    height="60%"
                    color="white"
                    px={5}
                >
                    <Heading as="h1" size="5xl" fontWeight="bold" mb={4}>
                        {title}
                    </Heading>
                    <Text fontSize="2xl" maxW="620px">
                        {description}
                    </Text>
                    {extraText && (
                        <Text fontSize="lg" maxW="620px" opacity={0.8}>
                            {extraText}
                        </Text>
                    )}
                </Box>

                {features && (
                    <FeaturesSection features={features} />
                )}
            </Container>
        </Box>
    );
}
