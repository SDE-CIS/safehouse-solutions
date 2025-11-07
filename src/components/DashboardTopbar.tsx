import { HStack, Flex } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LanguageModeButton } from "@/components/ui/language-mode";
import { ProfileButton } from "@/components/ProfileButton";

export function DashboardTopbar() {
    return (
        <Flex
            as="header"
            h="64px"
            px={6}
            align="center"
            justify="flex-end"
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="white"
            _dark={{ bg: "gray.800", borderColor: "gray.700" }}
            position="sticky"
            top="0"
            zIndex="10"
        >
            <HStack gap={4}>
                <ColorModeButton />
                <LanguageModeButton />
                <ProfileButton />
            </HStack>
        </Flex>
    );
}
