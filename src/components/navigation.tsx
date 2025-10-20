'use client';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Center,
    Collapsible,
    Container,
    Flex,
    HoverCardContent,
    HoverCardRoot,
    HoverCardTrigger,
    Image,
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
    Stack,
    Text,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { paths } from '@/config/paths';
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode.tsx";
import logo from '/images/logo.png';
import icon from '/images/icon.png';
import { LanguageModeButton } from './ui/language-mode';
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { loggedOut, selectCurrentAccessToken, selectUsername } from "@/services/login.ts";
import { Avatar } from "@/components/ui/avatar.tsx";

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
                        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}
                            alignItems="center">
                            <Image
                                src={icon}
                                alt="Icon"
                                h={{ base: '25px', lg: '25px' }}
                                w="auto"
                                mr={5}
                            />
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
                            <Stack flex={{ base: 1, md: 0 }} justify="flex-end" alignItems="center" direction="row"
                                gap={6}>
                                <Button
                                    fontSize="sm"
                                    fontWeight={400}
                                    variant="plain"
                                    _hover={{ color: "brand.500" }}
                                >
                                    <Link to={paths.auth.login.getHref(location.pathname)}>
                                        {t('auth.sign_in')}
                                    </Link>
                                </Button>
                                <Button
                                    display={{ base: 'none', md: 'inline-flex' }}
                                    fontSize="sm"
                                    fontWeight={600}
                                    color="white"
                                    bg="brand.600"
                                    _hover={{
                                        bg: 'brand.300',
                                    }}
                                >
                                    <Link to={"/auth/register"}>
                                        {t('auth.sign_up')}
                                    </Link>
                                </Button>
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

const ProfileButton = () => {
    const username = useAppSelector(selectUsername);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onLogout = () => {
        dispatch(loggedOut())
        navigate('/')
    }

    return (
        <MenuRoot>
            <MenuTrigger asChild>
                <Avatar
                    size={'sm'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                    cursor="pointer"
                />
            </MenuTrigger>
            <MenuContent
                style={{
                    position: 'absolute',
                    top: '100%',
                    left: '84%',
                    zIndex: 1000,
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    minWidth: '200px',
                }}
            >
                <Center mb={4}>
                    <Avatar
                        size={'2xl'}
                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                </Center>
                <Center mb={4}>
                    <p>{username}</p>
                </Center>

                {/* Dashboard Link */}
                <MenuItem value="dashboard" style={{ padding: 0 }}>
                    <Link
                        to="/dashboard"
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            padding: '8px 16px',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        {t('navigation.app')}
                    </Link>
                </MenuItem>

                {/* Profile Link */}
                <MenuItem value="profile" style={{ padding: 0 }}>
                    <Link
                        to="/dashboard/profile"
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            padding: '8px 16px',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        {t('navigation.profile')}
                    </Link>
                </MenuItem>

                {/* Log Out */}
                <MenuItem
                    value="log-out"
                    style={{ color: 'red.500', padding: 0 }}
                    onClick={onLogout}
                >
                    <Text
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            padding: '8px 16px',
                            textDecoration: 'none',
                            color: 'red',
                            cursor: 'pointer'
                        }}
                    >
                        {t('navigation.log_out')}
                    </Text>
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    )
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
                                        bg: "brand.500", // Adjust this to your theme color
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
