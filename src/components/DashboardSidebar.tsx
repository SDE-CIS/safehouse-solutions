"use client";

import {
    Box,
    VStack,
    HStack,
    Icon,
    Text,
    Button,
    Image,
    Collapsible,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    FiVideo,
    FiUsers,
    FiKey,
    FiBook,
    FiCreditCard,
    FiCoffee,
    FiCheck,
    FiDatabase,
    FiArchive,
    FiChevronRight,
    FiHome,
    FiAlertTriangle,
} from "react-icons/fi";
import logo from "/images/logo.png";
import { paths } from "@/config/paths";
import { useColorModeValue } from "./ui/color-mode";

const iconMap: Record<string, any> = {
    overview: FiHome,
    access: FiDatabase,
    keycards: FiKey,
    logs: FiCreditCard,
    users: FiUsers,
    food: FiCoffee,
    todo: FiCheck,
    video: FiVideo,
    live: FiVideo,
    archive: FiArchive,
    detections: FiAlertTriangle
};

interface PathDefItem {
    hidden?: boolean;
    label: string;
    getHref?: () => string;
}

function NavItem({
    pathKey,
    pathDef,
    depth = 0,
}: {
    pathKey: string;
    pathDef: PathDefItem & { path: string };
    depth?: number;
}) {
    const location = useLocation();
    const { t } = useTranslation();

    const active = location.pathname === pathDef.path;
    const subpaths = Object.entries(pathDef)
        .filter(([_k, v]) => !v.hidden && v.label && v.getHref)
        .map(([k, v]) => ({ key: k, ...v }));
    const hasChildren = subpaths.length > 0;

    const IconComp = iconMap[pathKey] || FiBook;
    const bgActive = useColorModeValue("blue.100", "blue.700");
    const textColor = useColorModeValue("gray.800", "gray.100");
    const hoverBg = useColorModeValue("gray.200", "gray.700");
    const indicatorColor = useColorModeValue("blue.500", "blue.300");

    return (
        <Box pl={depth * 4} position="relative">
            {hasChildren ? (
                <Collapsible.Root>
                    <Collapsible.Trigger asChild>
                        <Button
                            variant="ghost"
                            justifyContent="space-between"
                            w="full"
                            py={3}
                            px={4}
                            color={textColor}
                            bg={active ? bgActive : "transparent"}
                            fontWeight={active ? "semibold" : "medium"}
                            borderRadius="md"
                            transition="all 0.15s ease-in-out"
                            _hover={{
                                bg: hoverBg,
                                transform: "translateX(2px)",
                            }}
                        >
                            <HStack gap={3}>
                                <Box
                                    position="absolute"
                                    left="0"
                                    w="3px"
                                    h="100%"
                                    bg={active ? indicatorColor : "transparent"}
                                    borderRadius="sm"
                                    transition="all 0.2s"
                                />
                                <Icon as={IconComp} boxSize={4.5} opacity={0.85} />
                                <Text fontSize="sm" maxLines={1}>
                                    {t(`navigation.${pathDef.label.toLowerCase()}`)}
                                </Text>
                            </HStack>
                            <Collapsible.Indicator>
                                <Icon
                                    as={FiChevronRight}
                                    transition="transform 0.2s"
                                    _open={{ transform: "rotate(90deg)" }}
                                    opacity={0.6}
                                />
                            </Collapsible.Indicator>
                        </Button>
                    </Collapsible.Trigger>

                    <Collapsible.Content>
                        <VStack align="stretch" mt={1} gap={1}>
                            {subpaths.map((sub) => (
                                <NavItem
                                    key={sub.key}
                                    pathKey={sub.key}
                                    pathDef={sub}
                                    depth={depth + 1}
                                />
                            ))}
                        </VStack>
                    </Collapsible.Content>
                </Collapsible.Root>
            ) : (
                <Button
                    asChild
                    variant="ghost"
                    justifyContent="space-between"
                    w="full"
                    py={3}
                    px={4}
                    color={textColor}
                    bg={active ? bgActive : "transparent"}
                    fontWeight={active ? "semibold" : "medium"}
                    borderRadius="md"
                    transition="all 0.15s ease-in-out"
                    _hover={{
                        bg: hoverBg,
                        transform: "translateX(2px)",
                    }}
                >
                    <Link to={pathDef.getHref?.() ?? pathDef.path}>
                        <HStack gap={3}>
                            <Box
                                position="absolute"
                                left="0"
                                w="3px"
                                h="100%"
                                bg={active ? indicatorColor : "transparent"}
                                borderRadius="sm"
                                transition="all 0.2s"
                            />
                            <Icon as={IconComp} boxSize={4.5} opacity={0.85} />
                            <Text fontSize="sm" maxLines={1}>
                                {t(`navigation.${pathDef.label.toLowerCase()}`)}
                            </Text>
                        </HStack>
                    </Link>
                </Button>
            )}
        </Box>
    );
}

export function DashboardSidebar() {
    const bg = useColorModeValue("gray.50", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const shadowColor = useColorModeValue("md", "sm-dark");

    const dashboardPaths = Object.entries(paths.dashboard)
        .filter(([_, v]: any) => !v.hidden && v.label)
        .map(([k, v]) => ({ key: k, ...v }));

    return (
        <Box
            w="290px"
            h="100vh"
            bg={bg}
            borderRight="1px solid"
            borderColor={borderColor}
            boxShadow={shadowColor}
            px={5}
            py={6}
            overflowY="auto"
        >
            {/* Logo */}
            <Link to="/" style={{ textDecoration: "none" }}>
                <HStack mb={8} gap={3}>
                    <Image src={logo} alt="Logo" h="32px" />
                </HStack>
            </Link>

            {/* Navigation */}
            <VStack align="stretch" gap={1}>
                {dashboardPaths.map((item) => (
                    <NavItem key={item.key} pathKey={item.key} pathDef={item} />
                ))}
            </VStack>

            <Box mt={10} textAlign="center" fontSize="xs" color="gray.500">
                © {new Date().getFullYear()} Safehouse Solutions
            </Box>
        </Box>
    );
}
