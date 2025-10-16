import {Box, Container, Heading, Text} from '@chakra-ui/react';

interface BannerProps {
    imageUrl: string; // URL of the background image
    title: string; // Main heading text
    description: string; // Subtext description
    overlayColor?: string; // Optional overlay color (default: rgba(0, 0, 0, 0.5))
    size?: 'sm' | 'md' | 'lg'; // Banner size (height options)
}

export function Banner({
                           imageUrl,
                           title,
                           description,
                           overlayColor = 'rgba(0, 0, 0, 0.5)',
                           size = 'sm',
                       }: BannerProps) {
    const height = {
        sm: '50vh',
        md: '75vh',
        lg: '100vh',
    }[size];

    return (
        <Box position="relative" width="100%" height={height} overflow="hidden">
            {/* Background Image */}
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

            <Container maxW="container.xl" height="100%" flex={1}>
                {/* Overlay Text */}
                <Box
                    position="relative"
                    zIndex="1"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    height="100%"
                    color="white"
                    px={4}
                >
                    <Heading as="h1" size="5xl" fontWeight="bold" mb={4}>
                        {title}
                    </Heading>
                    <Text fontSize="2xl" maxW="620px">
                        {description}
                    </Text>
                </Box>
            </Container>
        </Box>
    );
}
