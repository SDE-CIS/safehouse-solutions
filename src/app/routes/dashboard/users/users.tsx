"use client";

import { useNavigate } from "react-router-dom";
import { Box, Heading, Spinner, Stack, Table } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUsersQuery } from "@/services/api";
import { Avatar } from "@/components/ui/avatar.tsx";
import { User } from "@/types/api/User";

export function UsersRoute() {
    const { t } = useTranslation();
    const { data: users, isLoading } = useUsersQuery();
    const navigate = useNavigate();

    return (
        <Box p={8}>
            <Heading mb={8} fontSize="2xl">
                {t("users.title")}
            </Heading>

            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                    transition="box-shadow 0.2s ease-in-out"
                >
                    <Table.Root
                        size="lg"
                        variant="outline"
                    >
                        <Table.Header
                            bg="gray.100"
                            _dark={{ bg: "gray.800" }}
                        >
                            <Table.Row>
                                <Table.Cell fontWeight="bold">{t("users.name")}</Table.Cell>
                                <Table.Cell fontWeight="bold">{t("users.email")}</Table.Cell>
                                <Table.Cell fontWeight="bold">{t("users.phone")}</Table.Cell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {users?.data.map((user: User, index: number) => (
                                <Table.Row
                                    key={user.ID}
                                    onClick={() => navigate(`/dashboard/users/${user.ID}`)}
                                    cursor="pointer"
                                    transition="all 0.15s ease-in-out"
                                    bg={index % 2 === 0 ? "transparent" : "gray.50"}
                                    _dark={{
                                        bg: index % 2 === 0 ? "transparent" : "gray.700",
                                    }}
                                    _hover={{
                                        bg: "gray.100",
                                        _dark: { bg: "gray.600" },
                                        transform: "scale(1.01)",
                                    }}
                                >
                                    <Table.Cell>
                                        <Stack direction="row" align="center" gap={4}>
                                            <Avatar name={`${user.FirstName} ${user.LastName}`} />
                                            <Box>
                                                {user.FirstName} {user.LastName}
                                            </Box>
                                        </Stack>
                                    </Table.Cell>
                                    <Table.Cell>{user.Email ?? t("users.no_email")}</Table.Cell>
                                    <Table.Cell>{user.PhoneNumber ?? t("users.no_phone")}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    );
}
