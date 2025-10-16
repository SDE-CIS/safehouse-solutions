'use client'

import { ReactNode } from 'react'

import { Box, Container, HStack, Icon, Image, SimpleGrid, Stack, Text, } from '@chakra-ui/react'
import { useColorModeValue } from './ui/color-mode'
import { Link } from "react-router-dom";
import { FaDribbble, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa6";
import logo from '/images/logo.png';

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    )
}

export function Footer() {
    return (
        <Box
            bg='gray.50'
            _dark={{ bg: 'black' }}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container as={Stack} maxW='container.xl' py={10}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' }}
                    gap={8}>
                    <Stack gap={6}>
                        <Box>
                            <Image
                                src={logo}
                                alt="Logo"
                                maxW="250px"
                            />
                        </Box>
                        <Text fontSize={'sm'}>© 2025 Safehouse Solutions</Text>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Product</ListHeader>
                        <Link to={'#'}>
                            Overview
                        </Link>
                        <Link to={'#'}>
                            Features
                        </Link>
                        <Link to={'#'}>
                            Tutorials
                        </Link>
                        <Link to={'#'}>
                            Pricing
                        </Link>
                        <Link to={'#'}>
                            Releases
                        </Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Company</ListHeader>
                        <Link to={'#'}>
                            About
                        </Link>
                        <Link to={'#'}>
                            Press
                        </Link>
                        <Link to={'#'}>
                            Careers
                        </Link>
                        <Link to={'#'}>
                            Contact
                        </Link>
                        <Link to={'#'}>
                            Partners
                        </Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Support</ListHeader>
                        <Link to={'#'}>
                            Help Center
                        </Link>
                        <Link to={'#'}>
                            Terms of Service
                        </Link>
                        <Link to={'#'}>
                            Legal
                        </Link>
                        <Link to={'#'}>
                            Privacy Policy
                        </Link>
                        <Link to={'#'}>
                            Status
                        </Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Follow Us</ListHeader>
                        <HStack>
                            <Link to={'https://facebook.com'}>
                                <Icon boxSize={6} color="gray.500">
                                    <FaFacebook />
                                </Icon>
                            </Link>
                            <Link to={'https://x.com'}>
                                <Icon boxSize={6} color="gray.500">
                                    <FaTwitter />
                                </Icon>
                            </Link>
                            <Link to={'https://dribbble.com'}>
                                <Icon boxSize={6} color="gray.500">
                                    <FaDribbble />
                                </Icon>
                            </Link>
                            <Link to={'https://instagram.com'}>
                                <Icon boxSize={6} color="gray.500">
                                    <FaInstagram />
                                </Icon>
                            </Link>
                            <Link to={'https://linkedin.com'}>
                                <Icon boxSize={6} color="gray.500">
                                    <FaLinkedin />
                                </Icon>
                            </Link>
                        </HStack>


                    </Stack>
                </SimpleGrid>
            </Container>
        </Box>
    )
}
