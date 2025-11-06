"use client";

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
    useKeycardsQuery,
    useCreateKeycardMutation,
    useUpdateKeycardMutation,
    useDeleteKeycardMutation,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { Keycard } from "@/types/api/Keycard";
import { Edit3, Trash2, Plus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useMqtt } from "@/hooks/useMqtt";

export function KeycardsRoute() {
    const { t } = useTranslation();
    const { data: keycards, isLoading, refetch } = useKeycardsQuery();
    const [createKeycard] = useCreateKeycardMutation();
    const [updateKeycard] = useUpdateKeycardMutation();
    const [deleteKeycard, { isLoading: isDeleting }] = useDeleteKeycardMutation();

    const [form, setForm] = useState({ Name: "", RfidTag: "" });
    const [editingKeycard, setEditingKeycard] = useState<Keycard | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const nameInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetForm = () => {
        setForm({ Name: "", RfidTag: "" });
        setEditingKeycard(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (keycard: Keycard) => {
        setEditingKeycard(keycard);
        setForm({ Name: keycard.Name || "", RfidTag: keycard.RfidTag });
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingKeycard) {
                await updateKeycard({
                    id: editingKeycard.ID,
                    data: form,
                }).unwrap();
                toaster.create({ description: t("keycards.updated"), type: "success" });
            } else {
                await createKeycard(form).unwrap();
                toaster.create({ description: t("keycards.created"), type: "success" });
            }
            refetch();
            setIsDialogOpen(false);
            setTimeout(resetForm, 200);
        } catch {
            toaster.create({
                description: t("keycards.action_failed"),
                type: "error",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteKeycard(id).unwrap();
            toaster.create({
                description: t("keycards.deleted"),
                type: "success",
            });
            refetch();
        } catch {
            toaster.create({
                description: t("keycards.delete_failed"),
                type: "error",
            });
        }
    };

    // ✅ Listen for new keycards scanned by your device
    const { message: scannedKeycard } = useMqtt({
        server: "192.168.1.127",
        port: 8080,
        username: "admin",
        password: "admin",
        clientId: "WebsiteClient",
        topic: "rfid/register",
    });

    useEffect(() => {
        if (!scannedKeycard) return;

        const raw = (scannedKeycard as any).data || scannedKeycard;
        console.log("Scanned Keycard:", raw);

        if (typeof raw === "string") {
            setForm((prev) => ({
                ...prev,
                RfidTag: raw, // ✅ only update the tag, keep Name as-is
            }));
            setIsDialogOpen(true);
        } else if (raw?.cardUID) {
            setForm((prev) => ({
                ...prev,
                RfidTag: raw.cardUID,
            }));
            setIsDialogOpen(true);
        }
    }, [scannedKeycard]);

    // ✅ Focus the Name field when dialog opens
    useEffect(() => {
        if (isDialogOpen && nameInputRef.current) {
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    }, [isDialogOpen]);

    return (
        <Box p={8}>
            <Stack direction="row" justify="space-between" align="center" mb={8}>
                <Heading fontSize="2xl">{t("keycards.title")}</Heading>

                <Button
                    colorScheme="blue"
                    leftIcon={<Plus size={16} />}
                    onClick={handleOpenCreate}
                >
                    {t("keycards.add_keycard")}
                </Button>
            </Stack>

            {/* ✅ Always-mounted Dialog (Chakra v3 compliant) */}
            <Dialog.Root
                open={isDialogOpen}
                onOpenChange={(details) => {
                    setIsDialogOpen(details.open);
                    if (!details.open) setTimeout(resetForm, 200);
                }}
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                {editingKeycard
                                    ? t("keycards.edit_keycard")
                                    : t("keycards.add_keycard")}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Fieldset.Root size="lg">
                                <Fieldset.Legend>{t("keycards.details")}</Fieldset.Legend>

                                <Field.Root>
                                    <Field.Label>{t("keycards.name")}</Field.Label>
                                    <Input
                                        ref={nameInputRef}
                                        name="Name"
                                        value={form.Name}
                                        onChange={handleChange}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>{t("keycards.rfid_tag")}</Field.Label>
                                    <Input
                                        name="RfidTag"
                                        value={form.RfidTag}
                                        onChange={handleChange}
                                    />
                                </Field.Root>
                            </Fieldset.Root>
                        </Dialog.Body>

                        <Dialog.Footer gap={4}>
                            <Button
                                variantStyle="reverse"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                {t("keycards.cancel")}
                            </Button>

                            <Button colorScheme="blue" onClick={handleSubmit}>
                                {editingKeycard ? t("keycards.update") : t("keycards.create")}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>

            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <Table.Root size="lg" variant="outline">
                        <Table.Header bg="gray.100" _dark={{ bg: "gray.800" }}>
                            <Table.Row>
                                <Table.Cell fontWeight="bold">{t("keycards.name")}</Table.Cell>
                                <Table.Cell fontWeight="bold">{t("keycards.rfid_tag")}</Table.Cell>
                                <Table.Cell fontWeight="bold">{t("keycards.actions")}</Table.Cell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {keycards?.data.map((keycard: Keycard, index: number) => (
                                <Table.Row
                                    key={keycard.ID}
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
                                    <Table.Cell>{keycard.Name}</Table.Cell>
                                    <Table.Cell>{keycard.RfidTag}</Table.Cell>
                                    <Table.Cell>
                                        <Stack direction="row" gap={3}>
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                variantStyle="outline"
                                                onClick={() => handleOpenEdit(keycard)}
                                            >
                                                <Edit3 size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                colorScheme="red"
                                                variantStyle="outline"
                                                onClick={() => handleDelete(keycard.ID)}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </Stack>
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
