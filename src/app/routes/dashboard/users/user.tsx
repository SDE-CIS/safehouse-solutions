"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, Spinner, Stack, Text, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUserQuery } from "@/services/api";
import { Avatar } from "@/components/ui/avatar.tsx";

export function UserRoute() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);

    if (isNaN(userId)) {
        return <Text>{t("users.not_found")}</Text>;
    }

    const { data: user, isLoading } = useUserQuery(userId);

    return (
        <Box p={8}>
            <Button
                onClick={() => navigate("/dashboard/users")}
                mb={6}
                variant="outline"
            >
                {t("users.back")}
            </Button>

            {isLoading ? (
                <Spinner size="lg" />
            ) : user ? (
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    p={8}
                    boxShadow="md"
                    maxW="xl"
                    mx="auto"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                >
                    <Stack align="center" gap={6}>
                        <Avatar
                            name={`${user.data.FirstName} ${user.data.LastName}`}
                            size="xl"
                        />
                        <Box textAlign="center">
                            <Heading fontSize="2xl">
                                {user.data.FirstName} {user.data.LastName}
                            </Heading>
                            <Text color="gray.500">{user.data.Username}</Text>
                        </Box>

                        <Box w="full">
                            <Stack gap={3}>
                                <Text><strong>{t("users.email")}:</strong> {user.data.Email ?? t("users.no_email")}</Text>
                                <Text><strong>{t("users.phone")}:</strong> {user.data.PhoneNumber ?? t("users.no_phone")}</Text>
                                <Text><strong>ID:</strong> {user.data.ID}</Text>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            ) : (
                <Text>{t("users.not_found")}</Text>
            )}
        </Box>
    );
}
