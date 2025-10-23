import { useEffect, useState } from "react";
import {
    Box,
    createListCollection,
    Heading,
    Input,
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEditKeycardMutation, useGetKeycardTiersQuery, useKeycardQuery } from "@/services/api";
import { Keycard } from "@/types/api/AuthResponse";
import { Button } from "@/components/ui/button.tsx";
import { Field } from "@/components/ui/field.tsx";

// Utility function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
};

export function KeycardRoute() {
    const { keycardId } = useParams<{ keycardId: string }>();
    const { data: keycardData, error, isLoading } = useKeycardQuery(Number(keycardId));
    const { data: accessLevelData } = useGetKeycardTiersQuery();
    const [editKeycard] = useEditKeycardMutation();
    const [selectedAccessLevel, setSelectedAccessLevel] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<Keycard>({
        defaultValues: {
            RfidTag: "",
            EmployeeId: 0,
            IssueDate: "",
            ExpireDate: "",
            StatusTypesId: 1,
            AccessLevels: [],
        },
    });

    useEffect(() => {
        if (keycardData) {
            reset({
                ...keycardData,
                IssueDate: formatDate(new Date(keycardData.IssueDate)),
                ExpireDate: formatDate(new Date(keycardData.ExpireDate)),
            });
        }
    }, [keycardData, reset]);

    const accessLevels = createListCollection({
        items: accessLevelData?.map((level) => ({ label: level.Name, value: level.Name })) || [],
    });

    const onSubmit: SubmitHandler<Keycard> = async (data) => {
        try {
            await editKeycard({ ...data, AccessLevels: selectedAccessLevel }).unwrap();
            alert("Keycard updated successfully!");
        } catch (err) {
            console.error("Error updating keycard:", err);
            alert("Failed to update keycard.");
        }
    };

    if (isLoading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error || !keycardData) {
        return (
            <Box textAlign="center" mt={10}>
                <Heading size="lg" color="red.500">
                    Failed to load keycard data.
                </Heading>
            </Box>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={8} fontSize="2xl">
                Edit Keycard
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={4} align="stretch">
                    <Field label="RFID Tag" invalid={Boolean(errors.RfidTag)} errorText={errors.RfidTag?.message}>
                        <Input
                            placeholder="Enter RFID Tag"
                            borderColor="gray.200"
                            _dark={{ borderColor: "gray.700" }}
                            {...register("RfidTag", { required: "RFID Tag is required" })}
                        />
                    </Field>

                    <Field
                        label="Employee ID"
                        invalid={Boolean(errors.EmployeeId)}
                        errorText={errors.EmployeeId?.message}
                    >
                        <Input
                            placeholder="Enter Employee ID"
                            type="number"
                            borderColor="gray.200"
                            _dark={{ borderColor: "gray.700" }}
                            {...register("EmployeeId", { required: "Employee ID is required" })}
                        />
                    </Field>

                    <Field
                        label="Issue Date"
                        invalid={Boolean(errors.IssueDate)}
                        errorText={errors.IssueDate?.message}
                    >
                        <Input
                            type="date"
                            borderColor="gray.200"
                            _dark={{ borderColor: "gray.700" }}
                            {...register("IssueDate", { required: "Issue Date is required" })}
                        />
                    </Field>

                    <Field
                        label="Expire Date"
                        invalid={Boolean(errors.ExpireDate)}
                        errorText={errors.ExpireDate?.message}
                    >
                        <Input
                            type="date"
                            borderColor="gray.200"
                            _dark={{ borderColor: "gray.700" }}
                            {...register("ExpireDate", { required: "Expire Date is required" })}
                        />
                    </Field>

                    <Controller
                        name="AccessLevels"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Field label="Access Levels">
                                <SelectRoot
                                    collection={accessLevels}
                                    value={value || []}
                                    onValueChange={(selectedValues) => {
                                        setSelectedAccessLevel(() => {
                                            const selected = [];
                                            selected.push(selectedValues.value[0]);

                                            return selected;
                                        });
                                        onChange(selectedValues);
                                    }}
                                >
                                    <SelectTrigger>
                                        {selectedAccessLevel.length ? selectedAccessLevel[0] : "None"}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accessLevels.items.map((level) => (
                                            <SelectItem item={level} key={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectRoot>
                            </Field>
                        )}
                    />

                    <Field
                        label="Status Type"
                        invalid={Boolean(errors.StatusTypesId)}
                        errorText={errors.StatusTypesId?.message}
                    >
                        <Input
                            type="number"
                            placeholder="Enter Status Type ID"
                            borderColor="gray.200"
                            _dark={{ borderColor: "gray.700" }}
                            {...register("StatusTypesId", { required: "Status Type is required" })}
                        />
                    </Field>

                    <VStack gap={4} pt={4}>
                        <Button type="submit" colorScheme="blue">
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => reset(keycardData)}
                            colorScheme="gray"
                        >
                            Reset
                        </Button>
                    </VStack>
                </VStack>
            </form>
        </Box>
    );
}
