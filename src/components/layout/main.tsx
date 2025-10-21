import { Navigation } from '../navigation';
import { Footer } from '../footer';
import { Box, Container } from "@chakra-ui/react";
import ScrollFadeIn from '@/ScrollFadeIn';

type MainLayoutProps = {
    children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navigation />
            <Container maxW="100vw" p={0} flex={1}>
                <ScrollFadeIn id="main" as="main">
                    {children}
                </ScrollFadeIn>
            </Container>
            <Footer />
        </Box>
    );
}
