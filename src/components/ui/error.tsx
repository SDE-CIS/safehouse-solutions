import { useColorModeValue } from './color-mode';
import { Container, Heading, Text } from '@chakra-ui/react';

interface ErrorProps {
    title: string,
    text: string
}

export function Error({ title, text }: ErrorProps) {
    const textColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Container textAlign="center" mt={10} maxW="container.xl" flex="1">
            <Heading size="lg" color="red.500">
                {title}
            </Heading>
            <Text color={textColor} mt={4}>
                {text}
            </Text>
        </Container>
    );
}
