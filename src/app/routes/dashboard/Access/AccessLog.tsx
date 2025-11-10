"use client";

import {
    Box,
    Heading,
    Spinner,
    Stack,
    Table,
    Badge,
    Text,
    Card,
} from "@chakra-ui/react";
import { useKeycardLogsQuery } from "@/services/api";
import { AccessLog } from "@/types/api/AccessLog";
import { useTranslation } from "react-i18next";

export function AccessLogsRoute() {
    const { data, isLoading, isError } = useKeycardLogsQuery();
    const { t } = useTranslation();

    if (isLoading)
        return (
            <Box p={8}>
                <Spinner size="lg" />
            </Box>
        );

    if (isError)
        return (
            <Box p={8}>
                <Text color="red.500">Failed to load access logs.</Text>
            </Box>
        );

    const logs = data?.data ?? [];

    return (
        <Box p={8}>
            <Stack direction="row" justify="space-between" align="center" mb={8}>
                <Heading fontSize="2xl">{t("access_logs")}</Heading>
                <Badge
                    variant="solid"
                    bgColor="green.600"
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="md"
                >
                    {logs.length} {t("entries")}
                </Badge>
            </Stack>

            {logs.length === 0 ? (
                <Text>{t("no_access_log_entries_found")}</Text>
            ) : (
                <Card.Root shadow="md" borderRadius="xl">
                    <Card.Body p={0}>
                        <Table.Root size="lg" variant="outline">
                            <Table.Header bg="gray.100" _dark={{ bg: "gray.800" }}>
                                <Table.Row>
                                    <Table.Cell fontWeight="bold">#</Table.Cell>
                                    <Table.Cell fontWeight="bold">{t("rfid_tag")}</Table.Cell>
                                    <Table.Cell fontWeight="bold">{t("location")}</Table.Cell>
                                    <Table.Cell fontWeight="bold">{t("time")}</Table.Cell>
                                    <Table.Cell fontWeight="bold">{t("granted")}</Table.Cell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {logs.map((log: AccessLog, index: number) => (
                                    <Table.Row
                                        key={log.ID}
                                        bg={index % 2 === 0 ? "transparent" : "gray.50"}
                                        _dark={{
                                            bg: index % 2 === 0 ? "transparent" : "gray.700",
                                        }}
                                        _hover={{
                                            bg: "gray.100",
                                            _dark: { bg: "gray.600" },
                                            transform: "scale(1.01)",
                                        }}
                                        transition="all 0.15s"
                                    >
                                        <Table.Cell>{log.ID}</Table.Cell>
                                        <Table.Cell>{log.RfidTag}</Table.Cell>
                                        <Table.Cell>#{log.LocationID}</Table.Cell>
                                        <Table.Cell>
                                            {new Date(log.AccessTime).toLocaleString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge
                                                bgColor={log.Granted ? "green.600" : "red.600"}
                                                variant="solid"
                                            >
                                                {log.Granted ? t("granted") : t("denied")}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Card.Body>
                </Card.Root>
            )}
        </Box>
    );
}
