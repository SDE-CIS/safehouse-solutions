import { Box } from "@chakra-ui/react";
import React from "react";
import { DashboardSidebar } from "../DashboardSidebar";

type DashboardLayoutProps = {
    children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <Box display="flex" minHeight="100vh" overflow="hidden">
            <DashboardSidebar />
            <Box flex="1" p={6} overflowY="auto" bg="gray.50" _dark={{ bg: "gray.800" }}>
                <div id="dialog-root"></div>
                {children}
            </Box>
        </Box>
    );
}
