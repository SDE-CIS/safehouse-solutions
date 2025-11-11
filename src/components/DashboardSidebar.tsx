"use client";

import {
    Box,
    VStack,
    HStack,
    Icon,
    Text,
    useDisclosure,
    Button,
    Collapsible,
    Image,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Link, useLocation } from "react-router-dom";
import { paths } from "@/config/paths";
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
    FiCircle,
} from "react-icons/fi";
import logo from "/images/logo.png";

const iconMap: Record<string, any> = {
    overview: FiCircle,
    cameras: FiVideo,
    videos: FiArchive,
    access: FiDatabase,
    keycards: FiKey,
    logs: FiCreditCard,
    users: FiUsers,
    food: FiCoffee,
    todo: FiCheck,
};

interface PathDefItem {
    hidden?: boolean;
    label: string;
    getHref?: () => string;
}

function NavItem({ pathKey, pathDef, depth = 0 }: { pathKey: string; pathDef: PathDefItem & { path: string; }; depth?: number; }) {
    const location = useLocation();
    const { t } = useTranslation();
    const disclosure = useDisclosure();

    const bgActive = useColorModeValue("blue.100", "blue.700");
    const textColor = useColorModeValue("gray.800", "gray.100");
    const hoverBg = useColorModeValue("gray.200", "gray.700");

    const subpaths = Object.entries(pathDef)
        .filter(([_k, v]) => !v.hidden && v.label && v.getHref)
        .map(([k, v]) => ({ key: k, ...v }));

    const hasChildren = subpaths.length > 0;

    const IconComp = iconMap[pathKey] || FiBook;
    const active = location.pathname === pathDef.path;

    return (
        <Box pl={2}>
            {hasChildren ? (
                <Button
                    variant="ghost"
                    justifyContent="space-between"
                    w="full"
                    color={textColor}
                    pl={depth * 4}
                    onClick={disclosure.onToggle}
                    bg={active ? bgActive : "transparent"}
                    _hover={{ bg: hoverBg }}
                >
                    <HStack>
                        <Icon as={IconComp} />
                        <Text>{t(`navigation.${pathDef.label.toLowerCase()}`)}</Text>
                    </HStack>
                </Button>
            ) : (
                <Button asChild variant="ghost" justifyContent="space-between" w="full" color={textColor} pl={depth * 4} bg={active ? bgActive : "transparent"} _hover={{ bg: hoverBg }}>
                    <Link to={pathDef.getHref?.() ?? "#"}>
                        <HStack>
                            <Icon as={IconComp} />
                            <Text>{t(`navigation.${pathDef.label.toLowerCase()}`)}</Text>
                        </HStack>
                    </Link>
                </Button>
            )}

            {hasChildren && (
                <Collapsible.Root open={disclosure.open} onOpenChange={disclosure.onToggle}>
                    <Collapsible.Content>
                        <VStack align="stretch" mt={2} gap={1}>
                            {subpaths.map((sub) => (
                                <NavItem key={sub.key} pathKey={sub.key} pathDef={sub} depth={depth + 1} />
                            ))}
                        </VStack>
                    </Collapsible.Content>
                </Collapsible.Root>
            )}
        </Box>
    );
}

export function DashboardSidebar() {
    const bg = useColorModeValue("gray.100", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    // Filter only the top-level dashboard paths
    const dashboardPaths = Object.entries(paths.dashboard)
        .filter(([_k, v]: any) => !v.hidden && v.label)
        .map(([k, v]) => ({ key: k, ...v }));

    return (
        <Box
            w="300px"
            h="100vh"
            p={4}
            bg={bg}
            borderRight="1px solid"
            borderColor={borderColor}
            overflowY="auto"
        >
            <Link to="/" style={{ textDecoration: "none" }}>
                <HStack mb={8}>
                    <Image src={logo} alt="Logo" h="34px" />
                </HStack>
            </Link>

            <VStack align="stretch" gap={2}>
                {dashboardPaths.map((item) => (
                    <NavItem key={item.key} pathKey={item.key} pathDef={item} />
                ))}
            </VStack>
        </Box>
    );
}
