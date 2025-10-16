import {
    Badge,
    Box,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useEmployeesQuery, usePackagesQuery } from "@/services/api";
import { useTranslation } from "react-i18next";
import { LuFolder, LuUser } from "react-icons/lu";
import { motion } from "framer-motion";
import { useColorModeValue } from "@/components/ui/color-mode.tsx";

export function OverviewRoute() {
    const { t } = useTranslation();

    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBgColor = useColorModeValue("white", "gray.800");
    const highlightColor = useColorModeValue("brand.500", "green.500");

    // Fetch employees
    const {
        data: employees = [],
        error: employeesError,
        isLoading: isLoadingEmployees,
    } = useEmployeesQuery(undefined, { pollingInterval: 10000 });

    // Fetch packages
    const {
        data: packages = [],
        error: packagesError,
        isLoading: isLoadingPackages,
    } = usePackagesQuery(undefined, { pollingInterval: 10000 });

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="xl" mb={6}>
                {t("dashboard.title")}
            </Heading>

            <Grid templateColumns={{ base: "1fr", lg: "2fr 3fr" }} gap={8}>
                {/* Employees Section */}
                <GridItem>
                    <Box
                        bg={bgColor}
                        borderRadius="md"
                        shadow="md"
                        overflow="hidden"
                        p={4}
                    >
                        <Flex alignItems="center" mb={4}>
                            <LuUser size={24} color={highlightColor} />
                            <Heading size="md" ml={2}>
                                {t("dashboard.employees.title")}
                            </Heading>
                        </Flex>

                        {isLoadingEmployees ? (
                            <Flex justifyContent="center" py={4}>
                                <Spinner size="lg" />
                            </Flex>
                        ) : employeesError ? (
                            <Text color="red.500">{t("dashboard.error.employees")}</Text>
                        ) : (
                            <Stack gap={4}>
                                {employees.map((employee) => (
                                    <Flex
                                        key={employee.Id}
                                        align="center"
                                        justify="space-between"
                                        bg={cardBgColor}
                                        p={3}
                                        borderRadius="md"
                                        shadow="sm"
                                    >
                                        <Box>
                                            <Text fontWeight="bold">
                                                {employee.Firstname} {employee.Lastname}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {employee.Position}
                                            </Text>
                                        </Box>
                                        <Badge
                                            colorScheme={employee.IsCheckIn ? "green" : "red"}
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            {employee.IsCheckIn
                                                ? t("inside")
                                                : t("outside")}
                                        </Badge>
                                    </Flex>
                                ))}
                                <Text fontSize="sm" textAlign="center" mt={4}>
                                    {t("dashboard.employees.total")}: {employees.length}
                                </Text>
                            </Stack>
                        )}
                    </Box>
                </GridItem>

                {/* Packages Section */}
                <GridItem>
                    <Box
                        bg={bgColor}
                        borderRadius="md"
                        shadow="md"
                        overflow="hidden"
                        p={4}
                    >
                        <Flex alignItems="center" mb={4}>
                            <LuFolder size={24} color={highlightColor} />
                            <Heading size="md" ml={2}>
                                {t("dashboard.products.title")}
                            </Heading>
                        </Flex>

                        {isLoadingPackages ? (
                            <Flex justifyContent="center" py={4}>
                                <Spinner size="lg" />
                            </Flex>
                        ) : packagesError ? (
                            <Text color="red.500">{t("dashboard.error.products")}</Text>
                        ) : packages.length > 0 ? (
                            <Grid
                                templateColumns={{
                                    base: "repeat(auto-fit, minmax(200px, 1fr))",
                                    lg: "repeat(auto-fit, minmax(250px, 1fr))",
                                }}
                                gap={6}
                            >
                                {packages.map((pack) => (
                                    <motion.div
                                        key={pack.Id}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Box
                                            bg={cardBgColor}
                                            borderRadius="md"
                                            shadow="sm"
                                            p={4}
                                            textAlign="center"
                                        >
                                            <Heading size="sm" mb={2}>
                                                {t("package_id")}: {pack.Id}
                                            </Heading>
                                            <Text fontSize="sm" color="gray.500">
                                                {t("customer")}: {pack.Customer}
                                            </Text>
                                            <Badge
                                                mt={3}
                                                px={2}
                                                py={1}
                                                colorScheme="blue"
                                                borderRadius="full"
                                            >
                                                {pack.Token}
                                            </Badge>
                                        </Box>
                                    </motion.div>
                                ))}
                            </Grid>
                        ) : (
                            <Text>{t("dashboard.products.no_products")}</Text>
                        )}
                    </Box>
                </GridItem>
            </Grid>
        </Container>
    );
}
