import { Navigation } from '../navigation';
import { Footer } from '../footer';
import { Box, Container } from "@chakra-ui/react";
import React from "react";

type MainLayoutProps = {
    children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navigation />
            <Container maxW="100vw" p={0} flex={1}>
                {children}
            </Container>
            <Footer />
        </Box>
    );
}
