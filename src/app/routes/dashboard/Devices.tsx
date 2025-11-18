"use client";

import {
    Box,
    Heading,
    Text,
    Card,
    CardHeader,
    CardBody,
    Badge,
    VStack,
    SimpleGrid,
    Skeleton,
    Stack,
    Dialog,
    Portal,
    Field,
    Input,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useDevicesQuery, useAssignLockMutation } from "@/services/api";
import { useMqtt } from "@/hooks/useMqtt";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cookies } from "react-cookie";
import { LocationSelect } from "./LocationSelect";
import { Button } from "@/components/ui/button";

const cookies = new Cookies();

export function DevicesRoute() {
    const { t } = useTranslation();
    const { data, isLoading, isError, refetch } = useDevicesQuery();
    const [createLock, { isLoading: creating }] = useAssignLockMutation();

    const userId = cookies.get("id") ?? "";

    const [liveEvent, setLiveEvent] = useState<{ status: string; deviceID: string } | null>(null);
    const [newDeviceId, setNewDeviceId] = useState("");
    const [locationId, setLocationId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const { message: mqttMessage } = useMqtt({
        server: "192.168.1.127",
        port: 8080,
        username: "admin",
        password: "admin",
        clientId: "WebsiteClient",
        topic: "rfid/assign",
    });

    useEffect(() => {
        if (mqttMessage) {
            try {
                const parsed = typeof mqttMessage === "string" ? JSON.parse(mqttMessage) : mqttMessage;
                const payload = parsed.data ?? parsed;

                if (payload?.DeviceID) {
                    setLiveEvent({ status: payload.status ?? "unknown", deviceID: payload.DeviceID });
                    setNewDeviceId(payload.DeviceID);
                    setOpen(true); // auto-open dialog when new device scanned

                    toaster.create({
                        description: t("device_status_changed", {
                            device: payload.DeviceID,
                            status: payload.status,
                        }),
                        type: payload.status === "assigned" ? "info" : "warning",
                        closable: true,
                    });
                }
            } catch (err) {
                console.warn("Invalid MQTT message:", mqttMessage, err);
            }
        }
    }, [mqttMessage, t]);

    // ✅ Submit handler
    const handleCreateLock = async () => {
        if (!userId || !newDeviceId || !locationId) {
            toaster.create({
                description: t("missing_fields_warning"),
                type: "warning",
                closable: true,
            });
            return;
        }

        try {
            const res = await createLock({
                DeviceID: newDeviceId,
                Location: locationId,
                UserID: userId,
                Active: true,
            }).unwrap();

            if (res.success) {
                toaster.create({
                    description: t("rfid_scanner_registered"),
                    type: "info",
                    closable: true,
                });
                setOpen(false);
                setNewDeviceId("");
                setLocationId(null);
                refetch();
            } else {
                toaster.create({
                    description: t("rfid_scanner_failed"),
                    type: "error",
                    closable: true,
                });
            }
        } catch {
            toaster.create({
                description: t("error_creating_lock"),
                type: "error",
                closable: true,
            });
        }
    };

    // ✅ Loading state
    if (isLoading) {
        return (
            <Box p={8}>
                <Heading size="lg" mb={6}>
                    {t("devices")}
                </Heading>
                <SimpleGrid columns={[1, 2, 3]} gap={6}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card.Root key={i} borderWidth="1px" borderRadius="xl" shadow="md" p={4}>
                            <Skeleton height="24px" mb={3} />
                            <Skeleton height="20px" mb={3} />
                            <Skeleton height="40px" />
                        </Card.Root>
                    ))}
                </SimpleGrid>
            </Box>
        );
    }

    // ✅ Error or empty
    if (isError || !data?.data?.length) {
        return (
            <Box p={8} textAlign="center">
                <Text color="red.500">{t("failed_to_load_devices")}</Text>
            </Box>
        );
    }

    return (
        <Box p={8}>
            <Stack align="center" mb={8}>
                <Heading size="lg">{t("device_management")}</Heading>
                <Text fontSize="sm" color="gray.500">
                    {t("view_and_monitor_all_connected_devices")}
                </Text>

                <Button onClick={() => setOpen(true)} colorScheme="blue" mt={4}>
                    {t("register_new_scanner")}
                </Button>

                {liveEvent && (
                    <Box
                        mt={4}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="gray.50"
                        textAlign="center"
                    >
                        <Text fontSize="sm" color="gray.600">
                            {t("live_update_device", {
                                device: liveEvent.deviceID,
                                status:
                                    liveEvent.status === "assigned"
                                        ? t("was_assigned")
                                        : t("was_unassigned"),
                            })}
                        </Text>
                    </Box>
                )}
            </Stack>

            <SimpleGrid columns={[1, 2, 3]} gap={6}>
                {data.data.map((device) => (
                    <Card.Root
                        key={device.ID}
                        borderWidth="2px"
                        borderRadius="xl"
                        shadow="lg"
                        transition="all 0.3s ease"
                        borderColor={device.Active ? "green.400" : "red.400"}
                        _hover={{
                            shadow: "xl",
                            borderColor: device.Active ? "green.500" : "red.500",
                        }}
                    >
                        <CardHeader textAlign="center">
                            <Heading size="sm">
                                {t("device")} #{device.ID}
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                {device.DeviceType}
                            </Text>
                        </CardHeader>

                        <CardBody>
                            <VStack gap={3}>
                                <Badge colorScheme={device.Active ? "green" : "red"} variant="subtle">
                                    {device.Active ? t("active") : t("inactive")}
                                </Badge>

                                <Text fontSize="sm" color="gray.600">
                                    {t("location_id")}: {device.LocationID ?? "—"}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    {t("user_id")}: {device.UserID ?? "—"}
                                </Text>

                                <Text fontSize="xs" color="gray.500" mt={2}>
                                    {t("added")}: {new Date(device.DateAdded).toLocaleString()}
                                </Text>
                            </VStack>
                        </CardBody>
                    </Card.Root>
                ))}
            </SimpleGrid>

            {/* 🧱 Chakra v3 Dialog Anatomy */}
            <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>{t("register_new_rfid_scanner")}</Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body pb="4">
                                <Stack gap="4">
                                    <Field.Root>
                                        <Field.Label>{t("detected_device_id")}</Field.Label>
                                        <Input
                                            value={newDeviceId}
                                            placeholder={t("waiting_for_scan")}
                                            readOnly
                                        />
                                    </Field.Root>

                                    <LocationSelect t={t} setLocationId={setLocationId} />
                                </Stack>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variantStyle="outline">{t("cancel")}</Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    colorScheme="blue"
                                    onClick={handleCreateLock}
                                    disabled={!newDeviceId || !locationId || creating}
                                >
                                    {t("create_lock")}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box>
    );
}
