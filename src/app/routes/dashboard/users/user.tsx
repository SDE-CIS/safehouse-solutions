"use client";

import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Heading,
    Spinner,
    Stack,
    Text,
    Dialog,
    Input,
    Fieldset,
    Field,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUserQuery, useUpdateUserMutation } from "@/services/api";
import { Avatar } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { ArrowBigLeft } from "lucide-react";

export function UserRoute() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);

    const { data: user, isLoading, refetch } = useUserQuery(userId);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const [form, setForm] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        PhoneNumber: "",
        Username: "",
    });

    // Pre-fill form when user data is loaded
    useEffect(() => {
        if (user?.data) {
            setForm({
                FirstName: user.data.FirstName ?? "",
                LastName: user.data.LastName ?? "",
                Email: user.data.Email ?? "",
                PhoneNumber: user.data.PhoneNumber ?? "",
                Username: user.data.Username ?? "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        try {
            await updateUser({ id: userId, data: form }).unwrap();
            toaster.create({
                description: t("users.updated"),
                type: "success",
                duration: 3000,
            });
            refetch();
        } catch {
            toaster.create({
                description: t("users.update_failed"),
                type: "error",
                duration: 4000,
            });
        }
    };

    if (isNaN(userId)) {
        return <Text>{t("users.not_found")}</Text>;
    }

    return (
        <Box p={8}>
            <Button onClick={() => navigate("/dashboard/users")} mb={6} variant="outline">
                <ArrowBigLeft size={16} />
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
                                <Text>
                                    <strong>{t("users.email")}:</strong>{" "}
                                    {user.data.Email ?? t("users.no_email")}
                                </Text>
                                <Text>
                                    <strong>{t("users.phone")}:</strong>{" "}
                                    {user.data.PhoneNumber ?? t("users.no_phone")}
                                </Text>
                                <Text>
                                    <strong>ID:</strong> {user.data.ID}
                                </Text>
                            </Stack>
                        </Box>

                        {/* ✅ Edit Dialog */}
                        <Dialog.Root>
                            <Dialog.Trigger asChild>
                                <Button colorScheme="blue">{t("users.edit_user")}</Button>
                            </Dialog.Trigger>

                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                                <Dialog.Content>
                                    <Dialog.CloseTrigger />
                                    <Dialog.Header>
                                        <Dialog.Title>{t("users.edit_user")}</Dialog.Title>
                                    </Dialog.Header>

                                    <Dialog.Body gap={6}>
                                        <Fieldset.Root size="lg">
                                            <Fieldset.Legend>{t("users.details")}</Fieldset.Legend>

                                            <Fieldset.Content gap={4}>
                                                <Field.Root>
                                                    <Field.Label>{t("users.first_name")}</Field.Label>
                                                    <Input
                                                        name="FirstName"
                                                        value={form.FirstName}
                                                        onChange={handleChange}
                                                    />
                                                </Field.Root>

                                                <Field.Root>
                                                    <Field.Label>{t("users.last_name")}</Field.Label>
                                                    <Input
                                                        name="LastName"
                                                        value={form.LastName}
                                                        onChange={handleChange}
                                                    />
                                                </Field.Root>

                                                <Field.Root>
                                                    <Field.Label>{t("users.email")}</Field.Label>
                                                    <Input
                                                        name="Email"
                                                        value={form.Email}
                                                        onChange={handleChange}
                                                        type="email"
                                                    />
                                                </Field.Root>

                                                <Field.Root>
                                                    <Field.Label>{t("users.phone")}</Field.Label>
                                                    <Input
                                                        name="PhoneNumber"
                                                        value={form.PhoneNumber}
                                                        onChange={handleChange}
                                                    />
                                                </Field.Root>

                                                <Field.Root>
                                                    <Field.Label>{t("users.username")}</Field.Label>
                                                    <Input
                                                        name="Username"
                                                        value={form.Username}
                                                        onChange={handleChange}
                                                    />
                                                </Field.Root>
                                            </Fieldset.Content>
                                        </Fieldset.Root>
                                    </Dialog.Body>

                                    <Dialog.Footer gap={4}>
                                        <Dialog.CloseTrigger asChild>
                                            <Button variant="ghost">{t("users.cancel")}</Button>
                                        </Dialog.CloseTrigger>
                                        <Button
                                            colorScheme="blue"
                                            onClick={handleUpdate}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? t("users.loading") : t("users.update")}
                                        </Button>
                                    </Dialog.Footer>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Dialog.Root>
                    </Stack>
                </Box>
            ) : (
                <Text>{t("users.not_found")}</Text>
            )}
        </Box>
    );
}
