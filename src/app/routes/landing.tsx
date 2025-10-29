"use client"

import { Banner } from "@/components/ui/banner"
import { useColorModeValue } from "@/components/ui/color-mode"
import { Slideshow } from "@/components/ui/slideshow"
import {
    Box,
    Card,
    Container,
    Flex,
    Heading,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next"
import { FaDoorClosed, FaEye, FaHouse } from "react-icons/fa6"

export function LandingRoute() {
    const { t } = useTranslation()

    const features = [
        {
            icon: <FaHouse />,
            title: t("landing.inventory"),
            text: t("landing.inventory.description"),
        },
        {
            icon: <FaEye />,
            title: t("landing.monitoring"),
            text: t("landing.monitoring.description"),
        },
        {
            icon: <FaDoorClosed />,
            title: t("landing.barcode"),
            text: t("landing.barcode.description"),
        },
    ]

    const bgCard = useColorModeValue("white", "gray.800")
    const borderCard = useColorModeValue("gray.200", "gray.700")
    const accent = useColorModeValue("brand.500", "brand.300")

    return (
        <>
            {/* Hero Banner */}
            <Banner
                imageUrl="/images/gradient4.jpg"
                title={t("landing.welcome")}
                description={t("landing.description")}
                extraText={t("landing.extra_text")}
                features={features}
                size="md"
                typing={true}
            />

            {/* About Section */}
            <Container maxW="container.xl" py={20} textAlign="center">
                <Heading size="4xl" mb={4}>
                    {t("landing.about_title")}
                </Heading>
                <Text fontSize="lg" maxW="700px" mx="auto" color="fg.muted" mb={6}>
                    {t("landing.about_description")}
                </Text>
                <Text fontSize="lg" maxW="700px" mx="auto" color="fg.muted">
                    {t("landing.about_description2")}
                </Text>
            </Container>

            {/* CTA Banner */}
            <Banner
                imageUrl="/images/smart.jpeg"
                title={t("landing.get_started")}
                description={t("landing.get_started_description")}
                size="sm"
                overlayColor="rgba(0, 0, 0, 0.4)"
            >
            </Banner>

            {/* How it Works */}
            <Box py={20} bg={useColorModeValue("gray.200", "gray.900")}>
                <Container maxW="container.lg">
                    <Heading size="4xl" mb={12} textAlign="center">
                        {t("landing.how_it_works")}
                    </Heading>
                    <VStack align="stretch" gap={10}>
                        {[
                            {
                                step: 1,
                                title: t("landing.step1_title"),
                                desc: t("landing.step1_desc"),
                            },
                            {
                                step: 2,
                                title: t("landing.step2_title"),
                                desc: t("landing.step2_desc"),
                            },
                            {
                                step: 3,
                                title: t("landing.step3_title"),
                                desc: t("landing.step3_desc"),
                            },
                        ].map((s, i) => (
                            <Flex
                                key={i}
                                align="flex-start"
                                gap={6}
                                direction={{ base: "column", md: i % 2 ? "row-reverse" : "row" }}
                            >
                                <Box
                                    minW="60px"
                                    h="60px"
                                    borderRadius="full"
                                    bg={accent}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="white"
                                    fontSize="xl"
                                    fontWeight="bold"
                                >
                                    {s.step}
                                </Box>
                                <Box flex="1" textAlign={i % 2 ? "right" : "left"}>
                                    <Heading size="xl" mb={2}>
                                        {s.title}
                                    </Heading>
                                    <Text fontSize="lg" color="fg.muted">{s.desc}</Text>
                                </Box>
                            </Flex>
                        ))}
                    </VStack>
                </Container>
            </Box>

            {/* Testimonials */}
            <Container maxW="container.xl" py={20}>
                <Heading size="4xl" mb={12} textAlign="center">
                    {t("landing.testimonials")}
                </Heading>
                <Stack
                    direction={{ base: "column", md: "row" }}
                    gap={8}
                    justify="center"
                    align="stretch"
                >
                    {[
                        {
                            name: "Alex Jensen",
                            quote: t("landing.testimonial1"),
                            role: t("landing.role1"),
                        },
                        {
                            name: "Sophia Eriksen",
                            quote: t("landing.testimonial2"),
                            role: t("landing.role2"),
                        },
                        {
                            name: "Solsol Lemansen",
                            quote: t("landing.testimonial3"),
                            role: t("landing.role3"),
                        },
                    ].map((p, i) => (
                        <Card.Root
                            key={i}
                            border="1px solid"
                            borderColor={borderCard}
                            bg={bgCard}
                            borderRadius="2xl"
                            boxShadow="md"
                            p={6}
                            transition="all 0.25s"
                            _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
                        >
                            <Card.Body gap={4}>
                                <Text fontStyle="italic" color="fg.muted">
                                    “{p.quote}”
                                </Text>
                                <Text fontWeight="bold">{p.name}</Text>
                                <Text fontSize="sm" color="fg.muted">
                                    {p.role}
                                </Text>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </Stack>
            </Container>

            {/* Projects Showcase */}
            <Slideshow
                slides={[
                    {
                        title: t("project_smart_home"),
                        description: t("project_smart_home_description"),
                        src: "/images/slideshow/smart_home.jpeg",
                        alt: t("project_smart_home"),
                    },
                    {
                        title: t("project_smart_office"),
                        description: t("project_smart_office_description"),
                        src: "/images/slideshow/office.jpeg",
                        alt: t("project_smart_office"),
                    },
                    {
                        title: t("project_smart_city"),
                        description: t("project_smart_city_description"),
                        src: "/images/slideshow/city.jpeg",
                        alt: t("project_smart_city"),
                    },
                ]}
            />
        </>
    )
}
