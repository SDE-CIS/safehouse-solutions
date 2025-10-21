import { Box, Flex, Text } from "@chakra-ui/react";

export function Statistics() {
    return (
        <Box p={6}>
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">
                    Total Users
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                    1,234
                </Text>
            </Flex>
        </Box>
    );
}
