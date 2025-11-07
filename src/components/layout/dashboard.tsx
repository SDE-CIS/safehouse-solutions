import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import { DashboardTopbar } from "../DashboardTopbar";

type DashboardLayoutProps = {
    children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <Flex minH="100vh" overflow="hidden">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main area */}
            <Flex direction="column" flex="1" overflow="hidden">
                <DashboardTopbar />
                <Box flex="1" p={6} overflowY="auto" bg="gray.50" _dark={{ bg: "gray.900" }}>
                    <div id="dialog-root"></div>
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
}
