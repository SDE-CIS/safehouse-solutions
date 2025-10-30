import {
    Box,
    Container,
    Heading,
    Table,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export function OverviewRoute() {
    // const { data, error, isLoading, isError } = useUnitsQuery();
    const { t } = useTranslation();

    // const isSchemaError =
    //     isError &&
    //     typeof (error as any)?.status !== "number" &&
    //     ((error as any)?.status === "PARSING_ERROR" ||
    //         String((error as any)?.error ?? "").includes("Zod"));

    // useEffect(() => {
    //     if (isSchemaError) {
    //         toaster.create({
    //             title: t("error"),
    //             description: t("the_api_response_schema_is_invalid"),
    //         });
    //     }
    // }, [isSchemaError, t]);

    // const units = data?.data ?? [];

    // const stats = useMemo(() => {
    //     if (!units.length) {
    //         return {
    //             total: 0,
    //             active: 0,
    //             inactive: 0,
    //             locations: 0,
    //             sensorTypes: 0,
    //         };
    //     }
    //     const active = units.filter((u) => u.Active).length;
    //     const locations = new Set(units.map((u) => u.LocationID)).size;
    //     const sensorTypes = new Set(units.map((u) => u.SensorTypeID)).size;
    //     return {
    //         total: units.length,
    //         active,
    //         inactive: units.length - active,
    //         locations,
    //         sensorTypes,
    //     };
    // }, [units]);

    // const formatDate = (s: string) => {
    //     const d = new Date(s);
    //     return isNaN(d.getTime()) ? s : d.toLocaleString();
    // };

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="xl" mb={6}>
                {t("dashboard.title")}
            </Heading>

            {/* Quick stats */}
            {/* <HStack gap={4} wrap="wrap" mb={6}>
                <StatCard label={t("total_units")} value={stats.total} />
                <StatCard label={t("active")} value={stats.active} />
                <StatCard label={t("inactive")} value={stats.inactive} />
                <StatCard label={t("locations")} value={stats.locations} />
                <StatCard label={t("sensor_types")} value={stats.sensorTypes} />
            </HStack> */}

            <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="bg"
                _dark={{ bg: "gray.800", borderColor: "gray.700" }}
            >
                {/* Table */}
                <Table.Root size="md" variant="outline">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>{t("id")}</Table.ColumnHeader>
                            <Table.ColumnHeader>{t("status")}</Table.ColumnHeader>
                            <Table.ColumnHeader>{t("date_added")}</Table.ColumnHeader>
                            <Table.ColumnHeader>{t("sensor_type")}</Table.ColumnHeader>
                            <Table.ColumnHeader>{t("location")}</Table.ColumnHeader>
                            <Table.ColumnHeader>{t("sensor_type_name")}</Table.ColumnHeader>
                            <Table.ColumnHeader>{t("location_name")}</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>

                    {/* <Table.Body>
                        {isLoading ? (
                            // Skeleton rows while loading
                            Array.from({ length: 5 }).map((_, i) => (
                                <Table.Row key={`sk-${i}`}>
                                    {Array.from({ length: 7 }).map((__, j) => (
                                        <Table.Cell key={j}>
                                            <Skeleton h="4" />
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))
                        ) : units.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={7} color="fg.muted">
                                    {isSchemaError
                                        ? t("invalid_api_response_schema.")
                                        : t("no_units_available.")}
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            units.map((u) => (
                                <Table.Row key={u.ID}>
                                    <Table.Cell>{u.ID}</Table.Cell>
                                    <Table.Cell>
                                        <Badge colorPalette={u.Active ? "green" : "gray"}>
                                            {u.Active ? t("active") : t("inactive")}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>{formatDate(u.DateAdded)}</Table.Cell>
                                    <Table.Cell>#{u.SensorTypeID}</Table.Cell>
                                    <Table.Cell>#{u.LocationID}</Table.Cell>
                                    <Table.Cell>{u.SensorTypeName}</Table.Cell>
                                    <Table.Cell>{u.LocationName}</Table.Cell>
                                </Table.Row>
                            ))
                        )}
                    </Table.Body> */}
                </Table.Root>
            </Box>

            {/* {isError && !isSchemaError && (
                <Box mt={4} color="fg.muted">
                    <Text fontSize="sm">
                        {t("there_was_a_problem_loading_units.")}{" "}
                        {(error as any)?.status && `(${(error as any).status})`}
                    </Text>
                </Box>
            )} */}
        </Container>
    );
}
