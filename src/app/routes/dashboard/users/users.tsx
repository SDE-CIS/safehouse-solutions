"use client";

import { useNavigate } from "react-router-dom";
import {
    Box,
    Heading,
    Spinner,
    Stack,
    Table,
    Dialog,
    Input,
    Fieldset,
    Field,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
    useUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
} from "@/services/api";
import { Avatar } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { User } from "@/types/api/User";
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react"; // Optional: for a nice delete icon

export function UsersRoute() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: users, isLoading, refetch } = useUsersQuery();
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const ref = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        PhoneNumber: "",
        Username: "",
        Password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreate = async () => {
        try {
            await createUser(form).unwrap();
            toaster.create({
                description: t("users.created"),
                type: "success",
                duration: 3000,
            });
            refetch();
            setForm({
                FirstName: "",
                LastName: "",
                Email: "",
                PhoneNumber: "",
                Username: "",
                Password: "",
            });
        } catch {
            toaster.create({
                description: t("users.create_failed"),
                type: "error",
                duration: 4000,
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id).unwrap();
            toaster.create({
                description: t("users.deleted"),
                type: "success",
                duration: 3000,
            });
            refetch();
        } catch {
            toaster.create({
                description: t("users.delete_failed"),
                type: "error",
                duration: 4000,
            });
        }
    };

    return (
        <Box p={8}>
            <Stack direction="row" justify="space-between" align="center" mb={8} gap={4}>
                <Heading fontSize="2xl">{t("users.title")}</Heading>

                <Dialog.Root initialFocusEl={() => ref.current}>
                    <Dialog.Backdrop />

                    <Dialog.Trigger asChild>
                        <Button colorScheme="blue">{t("users.add_user")}</Button>
                    </Dialog.Trigger>

                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.CloseTrigger />

                            <Dialog.Header>
                                <Dialog.Title>{t("users.add_user")}</Dialog.Title>
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
                                                ref={ref}
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
                                                type="email"
                                                value={form.Email}
                                                onChange={handleChange}
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

                                        <Field.Root>
                                            <Field.Label>{t("users.password")}</Field.Label>
                                            <Input
                                                name="Password"
                                                type="password"
                                                value={form.Password}
                                                onChange={handleChange}
                                            />
                                        </Field.Root>
                                    </Fieldset.Content>
                                </Fieldset.Root>
                            </Dialog.Body>

                            <Dialog.Footer gap={4}>
                                <Dialog.CloseTrigger asChild>
                                    <Button variantStyle="outline">{t("users.cancel")}</Button>
                                </Dialog.CloseTrigger>

                                <Button
                                    colorScheme="blue"
                                    onClick={handleCreate}
                                    disabled={isCreating}
                                >
                                    {isCreating ? t("users.loading") : t("users.create")}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>
            </Stack>

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
                    <Table.Root size="lg" variant="outline">
                        <Table.Header bg="gray.100" _dark={{ bg: "gray.800" }}>
                            <Table.Row>
                                <Table.Cell fontWeight="bold">{t("users.name")}</Table.Cell>
                                <Table.Cell fontWeight="bold">{t("users.email")}</Table.Cell>
                                <Table.Cell fontWeight="bold">{t("users.phone")}</Table.Cell>
                                <Table.Cell fontWeight="bold" textAlign="center">
                                    {t("users.actions")}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {users?.data.map((user: User, index: number) => (
                                <Table.Row
                                    key={user.ID}
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
                                    <Table.Cell onClick={() => navigate(`/dashboard/users/${user.ID}`)}>
                                        <Stack direction="row" align="center" gap={4}>
                                            <Avatar name={`${user.FirstName} ${user.LastName}`} src={user.ProfilePicture} />
                                            <Box>
                                                {user.FirstName} {user.LastName}
                                            </Box>
                                        </Stack>
                                    </Table.Cell>
                                    <Table.Cell onClick={() => navigate(`/dashboard/users/${user.ID}`)}>
                                        {user.Email ?? t("users.no_email")}
                                    </Table.Cell>
                                    <Table.Cell onClick={() => navigate(`/dashboard/users/${user.ID}`)}>
                                        {user.PhoneNumber ?? t("users.no_phone")}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Button
                                            colorScheme="red"
                                            size="sm"
                                            variantStyle="outline"
                                            onClick={() => handleDelete(user.ID)}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    );
}
