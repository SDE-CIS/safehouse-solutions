import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { FeaturesSection } from './features-section';
import { BannerProps } from '@/types/banner';

export function Banner({
    imageUrl,
    title,
    description,
    extraText,
    features,
    overlayColor = 'rgba(0, 0, 0, 0)',
    size = 'sm',
    typing = false,
}: BannerProps) {
    const height = {
        sm: '50vh',
        md: '75vh',
        lg: '100vh',
    }[size];

    const [typedText, setTypedText] = useState('');
    const typingSpeed = 100;

    useEffect(() => {
        if (!typing || !description) {
            setTypedText(description ?? '');
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
        <Box position="relative" width="100%" height={height} overflow="hidden">
            {/* Background Image with Overlay */}
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
                    height={features ? '60%' : '100%'}
                    color="white"
                    px={5}
                >
                    <Heading
                        as="h1"
                        size="5xl"
                        fontWeight="bold"
                        mb={4}
                    >
                        {title}
                    </Heading>

                    <Box position="relative" maxW="620px">
                        <Text
                            fontSize="2xl"
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
                            fontSize="2xl"
                            whiteSpace="pre-line"
                        >
                            {typedText}
                        </Text>
                    </Box>

                    {extraText && (
                        <Text
                            fontSize="lg"
                            mt="5px"
                            maxW="620px"
                            opacity={0.8}
                            whiteSpace="pre-line"
                        >
                            {extraText}
                        </Text>
                    )}
                </Box>

                {features && <FeaturesSection features={features} />}
            </Container>
        </Box>
    );
}
