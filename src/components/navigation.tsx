'use client';

import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    Collapsible,
    Container,
    Flex,
    HoverCardContent,
    HoverCardRoot,
    HoverCardTrigger,
    Image,
    Stack,
    Text,
} from '@chakra-ui/react';
import { FiLogIn, FiMenu, FiUserPlus } from 'react-icons/fi';
import { paths } from '@/config/paths';
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode.tsx";
import logo from '/images/logo.png';
import { LanguageModeButton } from './ui/language-mode';
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks";
import { selectCurrentAccessToken } from "@/services/login.ts";
import { Button } from './ui/button';
import { ProfileButton } from './ProfileButton.tsx';

export function DashboardNavigation() {
    const { t } = useTranslation();

    const dashboardPaths = Object.entries(paths.dashboard || {})
        .filter(([, value]) => !value.hidden && value.label)
        .map(([key, value]) => ({ key, ...value }));

    return (
        <Box
            bg={useColorModeValue('gray.100', 'gray.900')}
            borderBottom="1px"
            borderStyle="solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
            <Container maxW="container.xl" py={4}>
                <Flex align="center" justify="space-between">
                    {/* Logo */}
                    <Link to="/">
                        <Image
                            src={logo}
                            alt="Logo"
                            h={{ base: '25px', lg: '30px' }}
                            w="auto"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <Stack direction="row" gap={6} align="center" ml={8}>
                        {dashboardPaths.map(({ key, label, getHref }) => (
                            <Link
                                key={key}
                                to={getHref ? getHref() : '#'}
                                style={{
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    padding: '8px 16px',
                                }}
                            >
                                {t(`navigation.${label.toLowerCase()}`)}
                            </Link>
                        ))}
                    </Stack>

                    {/* Utility Buttons */}
                    <Stack direction="row" gap={6} align="center">
                        <ColorModeButton />
                        <LanguageModeButton />
                        <ProfileButton />
                    </Stack>
                </Flex>
            </Container>
        </Box>
    );
}

export function Navigation() {
    const location = useLocation();
    const { t } = useTranslation();

    const accessToken = useAppSelector(selectCurrentAccessToken);

    return (
        <Box
            bg={useColorModeValue('white', 'black')}
            borderBottom="1px"
            borderStyle="solid"
            borderColor={useColorModeValue('gray.200', 'gray.900')}
            zIndex="sticky"
            position="sticky"
            top="0"
            backdropFilter="saturate(180%) blur(8px)"
        >
            <Container maxW="container.xl">
                <Collapsible.Root>
                    <Flex
                        color={useColorModeValue('gray.600', 'white')}
                        minH="80px"
                        py={{ base: 2 }}
                        px={{ base: 4 }}
                        align="center"
                    >

                        {/* Mobile Menu Button */}
                        <Flex flex={{ base: 1, md: 'auto' }} display={{ base: 'flex', md: 'none' }}
                            alignItems="center">
                            <Collapsible.Trigger paddingY="3">
                                <Box><FiMenu /></Box>
                            </Collapsible.Trigger>
                        </Flex>

                        {/* Logo */}
                        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}
                            display={{ base: "none", md: "flex" }}>
                            <Link to="/">
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    h={{ base: '25px', lg: '30px' }}
                                    w="auto"
                                />
                            </Link>
                            <Flex display={{ base: 'none', md: 'flex' }} marginTop="0.1rem" marginLeft="3rem">
                                <DesktopNav />
                            </Flex>
                        </Flex>

                        <Stack flex={{ base: 1, md: 0 }} justify="flex-end" alignItems="center" direction="row"
                            gap={6} mr={6}>
                            <ColorModeButton />
                            <LanguageModeButton />
                        </Stack>

                        {/* Sign In / Sign Up */}
                        {accessToken ? (
                            <ProfileButton />
                        ) : (
                            <Stack
                                flex={{ base: 1, md: 0 }}
                                justify="flex-end"
                                alignItems="center"
                                direction="row"
                                gap={{ base: 3, md: 6 }}
                            >
                                <Link
                                    to={paths.auth.login.getHref(location.pathname)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                    }}
                                >
                                    {/* Sign In */}
                                    <Button
                                        variantStyle="reverse"
                                        fontSize={{ base: "sm", md: "md" }}
                                    >

                                        <FiLogIn style={{ display: "inline-block", marginTop: "2px" }} />
                                        <Text display={{ base: "none", md: "inline" }}>
                                            {t("auth.sign_in")}
                                        </Text>
                                    </Button>
                                </Link>

                                {/* Sign Up */}
                                <Link
                                    to="/auth/register"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Button
                                        fontSize={{ base: "sm", md: "md" }}
                                    >

                                        <FiUserPlus style={{ display: "inline-block", marginTop: "2px" }} />
                                        <Text display={{ base: "none", md: "inline" }}>
                                            {t("auth.sign_up")}
                                        </Text>
                                    </Button>
                                </Link>
                            </Stack>
                        )}
                    </Flex>

                    <Collapsible.Content>
                        <MobileNav />
                    </Collapsible.Content>
                </Collapsible.Root>
            </Container>
        </Box >
    );
}

const DesktopNav = () => {
    const { t } = useTranslation();
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const popoverContentBgColor = useColorModeValue('white', 'gray.900');
    const subLinkColor = useColorModeValue('brand.50', 'black');

    const filteredPaths = Object.entries(paths).filter(([, value]) => !value.hidden);

    return (
        <Stack direction="row" gap={12}>
            {filteredPaths.map(([key, { label, getHref, ...subPaths }]) => (
                <Box key={key}>
                    <HoverCardRoot openDelay={0} closeDelay={0}>
                        <HoverCardTrigger>
                            <Link to={getHref ? getHref() : '#'} color={linkColor}>
                                <Text
                                    textStyle="lg"
                                    position="relative"
                                    _after={{
                                        content: `""`,
                                        position: "absolute",
                                        width: "0%",
                                        height: "2px",
                                        bottom: "-4px",
                                        left: 0,
                                        bg: "brand.500",
                                        transition: "width 0.3s ease-in-out",
                                    }}
                                    _hover={{
                                        color: "brand.500",
                                        _after: {
                                            width: "100%",
                                        },
                                    }}
                                >
                                    {t(`navigation.${label?.toLowerCase().replace(' ', '_')}`).toUpperCase()}
                                </Text>
                            </Link>
                        </HoverCardTrigger>

                        {/* Sub-Navigation */}
                        {Object.values(subPaths)
                            .filter((subPath) => !subPath.hidden && subPath.getHref)
                            .length > 0 && (
                                <HoverCardContent
                                    position="absolute"
                                    border={0}
                                    boxShadow="xl"
                                    bg={popoverContentBgColor}
                                    p={4}
                                    rounded="xl"
                                    minW="sm"
                                >
                                    <Stack>
                                        {Object.entries(subPaths)
                                            .filter(([, subPath]) => !subPath.hidden && subPath.getHref)
                                            .map(([subKey, subPath]) => (
                                                <Link to={subPath.getHref()} key={subKey}>
                                                    <Box
                                                        role="group"
                                                        display="block"
                                                        p={2}
                                                        rounded="md"
                                                        _hover={{ bg: subLinkColor }}
                                                    >
                                                        <Text textStyle="md">
                                                            {t(`navigation.${subPath.label.toLowerCase()}`)}
                                                        </Text>
                                                        <Text textStyle="xs">
                                                            {t(
                                                                `navigation.${subPath.label.toLowerCase()}.description`
                                                            )}
                                                        </Text>
                                                    </Box>
                                                </Link>
                                            ))}
                                    </Stack>
                                </HoverCardContent>
                            )}
                    </HoverCardRoot>
                </Box>
            ))}
        </Stack>
    );
};

const MobileNav = () => {
    // Filter top-level paths that are not hidden
    const filteredPaths = Object.entries(paths).filter(([, value]) => !value.hidden);

    return (
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
            {filteredPaths.map(([key, { label, getHref, ...subPaths }]) => (
                <Box key={key} py={2}>
                    <Link
                        to={getHref ? getHref() : '#'}
                        style={{
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'block',
                        }}
                    >
                        {label}
                    </Link>

                    {/* Render Sub-Paths */}
                    {Object.values(subPaths)
                        .filter((subPath) => !subPath.hidden && subPath.getHref)
                        .length > 0 && (
                            <Stack pl={4} mt={2} borderLeft="1px solid" borderColor="gray.200">
                                {Object.entries(subPaths)
                                    .filter(([, subPath]) => !subPath.hidden && subPath.getHref)
                                    .map(([subKey, subPath]) => (
                                        <Link
                                            key={subKey}
                                            to={subPath.getHref()}
                                            style={{
                                                textDecoration: 'none',
                                                fontWeight: 500,
                                                padding: '2px 0',
                                            }}
                                        >
                                            {subPath.label}
                                        </Link>
                                    ))}
                            </Stack>
                        )}
                </Box>
            ))}
        </Stack>
    );
};
