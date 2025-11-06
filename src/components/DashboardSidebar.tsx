import { Box, VStack, HStack, Icon, Text, useDisclosure, Image, Collapsible, Button } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { FiHome, FiVideo, FiUsers, FiKey, FiChevronRight } from "react-icons/fi";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LanguageModeButton } from "@/components/ui/language-mode";
import { ProfileButton } from "@/components/ProfileButton";
import logo from "/images/logo.png";
import { useTranslation } from "react-i18next";
import { paths } from "@/config/paths";
import { Book } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DashboardSidebar() {
    const { t } = useTranslation();
    const location = useLocation();

    const bg = useColorModeValue("gray.100", "gray.900");
    const activeBg = useColorModeValue("blue.100", "blue.700");
    const textColor = useColorModeValue("gray.800", "gray.100");

    const access = useDisclosure();

    const navItems = [
        { label: t("navigation.dashboard"), icon: FiHome, href: paths.dashboard.overview.getHref() },
        { label: t("navigation.cameras"), icon: FiVideo, href: paths.dashboard.cameras.getHref() },
        {
            label: t("navigation.access"),
            icon: FiKey,
            children: [
                { label: t("navigation.keycards"), href: paths.dashboard.keycards.getHref(), icon: FiKey },
                { label: t("navigation.access_logs"), href: paths.dashboard.access_logs.getHref(), icon: Book },
            ],
        },
        { label: t("navigation.users"), icon: FiUsers, href: paths.dashboard.users.getHref() },
    ];

    return (
        <Box
            w="260px"
            h="100vh"
            p={4}
            bg={bg}
            borderRight="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Box>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <HStack mb={8}>
                        <Image src={logo} alt="Logo" h="30px" />
                    </HStack>
                </Link>

                <VStack align="stretch" gap={2}>
                    {navItems.map((item) =>
                        item.children ? (
                            <Collapsible.Root key={item.label} open={access.open} onOpenChange={access.onToggle}>
                                <Collapsible.Trigger asChild>
                                    <Button
                                        variant="ghost"
                                        w="full"
                                        justifyContent="space-between"
                                        color={textColor}
                                        _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
                                    >
                                        <HStack>
                                            <Icon as={item.icon} />
                                            <Text>{item.label}</Text>
                                        </HStack>
                                        <Collapsible.Indicator>
                                            <Icon
                                                as={FiChevronRight}
                                                transition="transform 0.2s"
                                                _open={{ transform: "rotate(90deg)" }}
                                            />
                                        </Collapsible.Indicator>
                                    </Button>
                                </Collapsible.Trigger>

                                <Collapsible.Content>
                                    <VStack align="stretch" pl={8} mt={2} gap={1}>
                                        {item.children.map((child) => {
                                            const active = location.pathname === child.href;
                                            return (
                                                <Link to={child.href} key={child.label}>
                                                    <HStack
                                                        px={3}
                                                        py={2}
                                                        borderRadius="md"
                                                        bg={active ? activeBg : "transparent"}
                                                        _hover={{ bg: activeBg }}
                                                        transition="background 0.2s"
                                                    >
                                                        <Icon as={child.icon} />
                                                        <Text>{child.label}</Text>
                                                    </HStack>
                                                </Link>
                                            );
                                        })}
                                    </VStack>
                                </Collapsible.Content>
                            </Collapsible.Root>
                        ) : (
                            <Link to={item.href!} key={item.label}>
                                <HStack
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                    bg={location.pathname === item.href ? activeBg : "transparent"}
                                    _hover={{ bg: activeBg }}
                                    transition="background 0.2s"
                                >
                                    <Icon as={item.icon} />
                                    <Text>{item.label}</Text>
                                </HStack>
                            </Link>
                        )
                    )}
                </VStack>
            </Box>

            <Box>
                <HStack justify="space-between">
                    <ColorModeButton />
                    <LanguageModeButton />
                    <ProfileButton />
                </HStack>
            </Box>
        </Box>
    );
}
