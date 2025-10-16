"use client";

import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Heading, Spinner, Stack, Table} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {useUsersQuery} from "@/services/api";
import {User} from "@/types/api";
import {Avatar} from "@/components/ui/avatar.tsx";

export function UsersRoute() {
    const { t } = useTranslation();
    const { data: users, isLoading } = useUsersQuery();
    const [groupedUsers, setGroupedUsers] = useState<Record<string, User[]>>({});
    const navigate = useNavigate();

    useEffect(() => {
        console.log(users)

        if (users) {
            // Group users by roles
            const savedUsers: string[] = [];
            const grouped = users.reduce((acc, user) => {
                if (savedUsers.includes(user.Username)) {
                    return acc;
                }

                savedUsers.push(user.Username);

                if (user.Roles.length > 0) {
                    user.Roles.forEach((role) => {
                        if (!acc[role]) {
                            acc[role] = [];
                        }
                        acc[role].push(user);
                    });
                } else {
                    if (!acc["_"]) {
                        acc["_"] = [];
                    }
                    acc["_"].push(user);
                }

                return acc;
            }, {} as Record<string, User[]>);
            setGroupedUsers(grouped);
        }
    }, [users]);

    return (
        <Box p={8}>
            <Heading mb={8} fontSize="2xl">
                {t("users.title")}
            </Heading>

            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <Stack gap="10">
                    {Object.entries(groupedUsers).sort().map(([role, users]) => (
                        <Box key={role}>
                            <Heading fontSize="lg" mb={4}>
                                {t(`roles.${role.toLowerCase()}`, role)}
                            </Heading>
                            <Table.Root size="lg" variant="outline">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>{t("users.username")}</Table.ColumnHeader>
                                        <Table.ColumnHeader>{t("users.roles")}</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {users.map((user) => (
                                        <Table.Row
                                            key={user.Id}
                                            onClick={() => navigate(`/dashboard/users/${user.Id}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Table.Cell>{user.Username}</Table.Cell>
                                            <Table.Cell>
                                                {user.Roles.map((role) => role).join(", ")}
                                            </Table.Cell>
                                            <Table.Cell textAlign="end">
                                                <Avatar src={user.ProfilePicture} name={user.Username} size="sm" />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
