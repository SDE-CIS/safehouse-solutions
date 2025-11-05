import { Box, Container } from "@chakra-ui/react";
import React from "react";
import { DashboardNavigation } from "@/components/navigation";

type DashboardLayoutProps = {
    children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <DashboardNavigation />
            <Container maxW="container.xl">
                <div id="dialog-root"></div>
                {children}
            </Container>
        </Box>
    );
}
