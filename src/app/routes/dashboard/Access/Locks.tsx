"use client";

import {
    Box,
    Heading,
    Stack,
    Text,
    Card,
    CardHeader,
    CardBody,
    VStack,
    Field,
    Switch,
    Skeleton,
    SimpleGrid,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useLockKeycardScannerMutation, useLocksQuery } from "@/services/api";
import { useTranslation } from "react-i18next";

const cookies = new Cookies();

export function LocksRoute() {
    const userId = cookies.get("id") ?? "";
    const { t } = useTranslation();

    // Fetch all locks dynamically
    const { data, isLoading, isError } = useLocksQuery(userId);
    const [lockStates, setLockStates] = useState<Record<number, boolean>>({});
    const [lockKeycardScanner] = useLockKeycardScannerMutation();

    // Sync local state with fetched locks
    useEffect(() => {
        if (data?.data?.length) {
            const newState: Record<number, boolean> = {};
            for (const lock of data.data) {
                newState[lock.ID] = lock.Locked;
            }
            setLockStates(newState);
        }
    }, [data]);

    const handleToggleLock = async (lockId: number, locked: boolean) => {
        if (!userId) {
            toaster.create({
                description: t("missing_userId"),
                type: "warning",
                closable: true,
            });
            return;
        }

        setLockStates((prev) => ({ ...prev, [lockId]: locked }));

        try {
            const res = await lockKeycardScanner({
                DeviceID: String(lockId),
                UserID: userId,
                Location: 1,
                isLocked: locked,
            }).unwrap();

            if (res.success) {
                toaster.create({
                    description: locked
                        ? t("keycard_scanner_locked_successfully")
                        : t("keycard_scanner_unlocked_successfully"),
                    type: "info",
                    closable: true,
                });
            } else {
                toaster.create({
                    description: t("operation_failed_try_again_later"),
                    type: "error",
                    closable: true,
                });
            }
        } catch {
            toaster.create({
                description: t("failed_to_connect_to_scanner_service"),
                type: "error",
                closable: true,
            });
        }
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <Box p={8}>
                <SimpleGrid columns={[1, 2, 3]} gap={6}>
                    {Array.from({ length: 3 }).map((_, i) => (
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

    // Error or no data
    if (isError || !data?.data?.length) {
        return (
            <Box p={8} textAlign="center">
                <Text color="red.500">{t("failed_to_load_locks")}</Text>
            </Box>
        );
    }

    return (
        <Box p={8}>
            <Heading size="lg" mb={8} textAlign="center">
                {t("door_lock_management")}
            </Heading>

            <SimpleGrid columns={[1, 2, 3]} gap={6}>
                {data.data.map((lock) => {
                    const locked = lockStates[lock.ID] ?? false;

                    return (
                        <Card.Root
                            key={lock.ID}
                            borderWidth="2px"
                            borderRadius="xl"
                            shadow="lg"
                            transition="all 0.3s ease"
                            borderColor={locked ? "red.400" : "green.400"}
                            _hover={{
                                shadow: "xl",
                                borderColor: locked ? "red.500" : "green.500",
                            }}
                        >
                            <CardHeader textAlign="center">
                                <Heading size="sm">Lock #{lock.ID}</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    {t("location")}: {lock.LocationID}
                                </Text>
                            </CardHeader>

                            <CardBody>
                                <VStack gap={4} align="stretch">
                                    <Box textAlign="center">
                                        <Text
                                            fontSize="lg"
                                            fontWeight="bold"
                                            color={locked ? "red.500" : "green.500"}
                                        >
                                            {locked ? t("locked") : t("unlocked")}
                                        </Text>
                                    </Box>

                                    <Field.Root>
                                        <Field.Label>{t("status")}</Field.Label>
                                        <Stack direction="row" align="center" justify="space-between" w="full">
                                            <Text>{locked ? t("locked") : t("unlocked")}</Text>
                                            <Switch.Root
                                                checked={locked}
                                                onCheckedChange={(e) => handleToggleLock(lock.ID, e.checked)}
                                            >
                                                <Switch.HiddenInput />
                                                <Switch.Control>
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                                <Switch.Label srOnly>
                                                    {locked ? t("locked") : t("unlocked")}
                                                </Switch.Label>
                                            </Switch.Root>
                                        </Stack>
                                    </Field.Root>
                                </VStack>
                            </CardBody>
                        </Card.Root>
                    );
                })}
            </SimpleGrid>
        </Box>
    );
}
