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
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { useLockKeycardScannerMutation } from "@/services/api";

const cookies = new Cookies();

export function LocksRoute() {
    const deviceId = "2c428c842178";
    const userId = cookies.get("id") ?? "";
    const [isLocked, setIsLocked] = useState(false);
    const [lockKeycardScanner, { isLoading }] = useLockKeycardScannerMutation();

    const handleSubmit = async () => {
        if (!userId) {
            toaster.create({
                description: "Missing user ID. Please log in again.",
                type: "warning",
                closable: true,
            });
            return;
        }

        try {
            const res = await lockKeycardScanner({
                DeviceID: deviceId,
                UserID: userId,
                Location: 1,
                isLocked: isLocked,
            }).unwrap();

            if (res.success) {
                toaster.create({
                    description: isLocked
                        ? "Keycard scanner locked successfully."
                        : "Keycard scanner unlocked successfully.",
                    type: "info",
                    closable: true,
                });
            } else {
                toaster.create({
                    description: "Operation failed. Try again later.",
                    type: "error",
                    closable: true,
                });
            }
        } catch {
            toaster.create({
                description: "Failed to connect to the scanner service.",
                type: "error",
                closable: true,
            });
        }
    };

    return (
        <Box p={8} display="flex" justifyContent="center" alignItems="center">
            <Card.Root
                maxW="md"
                w="full"
                borderWidth="2px"
                borderRadius="xl"
                shadow="lg"
                transition="all 0.3s ease"
                borderColor={isLocked ? "red.400" : "green.400"}
                _hover={{
                    shadow: "xl",
                    borderColor: isLocked ? "red.500" : "green.500",
                }}
            >
                <CardHeader textAlign="center">
                    <Heading size="md" mb={1}>
                        Keycard Scanner Control
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                        Manage the door lock remotely.
                    </Text>
                </CardHeader>

                <CardBody>
                    <VStack gap={6} align="stretch">
                        <Box textAlign="center" py={2}>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={isLocked ? "red.500" : "green.500"}
                            >
                                {isLocked ? "Locked" : "Unlocked"}
                            </Text>
                        </Box>

                        <Field.Root>
                            <Field.Label>Status</Field.Label>
                            <Stack direction="row" align="center" justify="space-between" w="full">
                                <Text>{isLocked ? "Locked" : "Unlocked"}</Text>
                                <Switch.Root
                                    checked={isLocked}
                                    onCheckedChange={(e) => setIsLocked(e.checked)}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                    <Switch.Label srOnly>
                                        {isLocked ? "Locked" : "Unlocked"}
                                    </Switch.Label>
                                </Switch.Root>
                            </Stack>
                        </Field.Root>

                        <Button
                            onClick={handleSubmit}
                            loading={isLoading}
                            w="full"
                            colorScheme={isLocked ? "red" : "green"}
                            size="lg"
                        >
                            {isLocked ? "Lock Scanner" : "Unlock Scanner"}
                        </Button>
                    </VStack>
                </CardBody>
            </Card.Root>
        </Box>
    );
}
