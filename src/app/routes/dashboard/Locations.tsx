"use client"

import {
    Box,
    Heading,
    Text,
    Stack,
    Dialog,
    Portal,
    Field,
    Input,
    Table,
} from "@chakra-ui/react"
import { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import {
    useLocationsQuery,
    useCreateLocationMutation,
    useUpdateLocationMutation,
    useDeleteLocationMutation,
} from "@/services/api"
import { toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { FiEdit, FiTrash } from "react-icons/fi"

export function LocationsRoute() {
    const { t } = useTranslation()

    const { data, isLoading, refetch } = useLocationsQuery()
    const [createLocation] = useCreateLocationMutation()
    const [updateLocation] = useUpdateLocationMutation()
    const [deleteLocation] = useDeleteLocationMutation()

    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [locationName, setLocationName] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null)

    const openCreateModal = () => {
        setEditingId(null)
        setLocationName("")
        setIsEditing(true)
    }

    const openEditModal = (id: number, name: string) => {
        setEditingId(id)
        setLocationName(name)
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            if (editingId) {
                await updateLocation({ id: editingId, LocationName: locationName }).unwrap()
                toaster.create({
                    description: t("location_updated_successfully"),
                    type: "info",
                    closable: true,
                })
            } else {
                await createLocation({ LocationName: locationName }).unwrap()
                toaster.create({
                    description: t("location_created_successfully"),
                    type: "success",
                    closable: true,
                })
            }

            refetch()
            setIsEditing(false)
        } catch (err) {
            toaster.create({
                description: (err as any)?.data?.message ?? t("failed_to_save_location"),
                type: "error",
                closable: true,
            })
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteLocation(id).unwrap()
            toaster.create({
                description: t("location_deleted_successfully"),
                type: "info",
                closable: true,
            })
            refetch()
        } catch (err) {
            toaster.create({
                description: (err as any)?.data?.message ?? t("failed_to_delete_location"),
                type: "error",
                closable: true,
            })
        }
    }

    return (
        <Box p={8}>
            <Stack direction="row" justify="space-between" align="center" mb={6}>
                <Heading size="lg">{t("location_management")}</Heading>
                <Button onClick={openCreateModal}>{t("add_location")}</Button>
            </Stack>

            {isLoading ? (
                <Text>{t("loading")}...</Text>
            ) : (
                <Table.Root>
                    <Table.Caption>{t("list_of_locations")}</Table.Caption>

                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>{t("location_name")}</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="right">
                                {t("actions")}
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data?.data?.map((loc) => (
                            <Table.Row key={loc.ID}>
                                <Table.Cell>{loc.ID}</Table.Cell>
                                <Table.Cell>{loc.LocationName}</Table.Cell>
                                <Table.Cell textAlign="right">
                                    <Button
                                        aria-label={t("edit")}
                                        size="sm"
                                        variantStyle="outline"
                                        onClick={() => openEditModal(loc.ID, loc.LocationName)}
                                        mr={2}
                                    >
                                        <FiEdit />
                                    </Button>
                                    <Button
                                        aria-label={t("delete")}
                                        size="sm"
                                        variantStyle="outline"
                                        colorScheme="red"
                                        onClick={() => handleDelete(loc.ID)}
                                    >
                                        <FiTrash />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.Cell colSpan={3}>
                                <Text fontSize="sm" color="gray.500" textAlign="center">
                                    {t("total_locations")}: {data?.data?.length ?? 0}
                                </Text>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Footer>
                </Table.Root>
            )}

            {/* 🧱 Chakra v3 Dialog Anatomy (Controlled Open State) */}
            <Dialog.Root open={isEditing} onOpenChange={(e) => setIsEditing(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    {editingId ? t("edit_location") : t("create_location")}
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body pb="4">
                                <Field.Root>
                                    <Field.Label>{t("location_name")}</Field.Label>
                                    <Input
                                        ref={inputRef}
                                        placeholder={t("enter_location_name")}
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                    />
                                </Field.Root>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variantStyle="outline">{t("cancel")}</Button>
                                </Dialog.ActionTrigger>
                                <Button onClick={handleSave}>{t("save")}</Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box>
    )
}
