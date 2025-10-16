"use client";

import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Flex, Heading, Input, Spinner, Stack, Table, VStack} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {useAddKeycardMutation, useKeycardsQuery, useEmployeesQuery} from "@/services/api";
import {Keycard} from "@/types/api";
import {Button} from "@/components/ui/button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Field} from "@/components/ui/field.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export function KeycardsRoute() {
    const {t} = useTranslation();
    const {data: keycards, isLoading: isKeycardsLoading} = useKeycardsQuery();
    const {data: employees, isLoading: isEmployeesLoading} = useEmployeesQuery();
    const [addKeycard] = useAddKeycardMutation();
    const [groupedKeycards, setGroupedKeycards] = useState<Record<string, Keycard[]>>({});
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);

    const {
        handleSubmit,
        register,
        reset,
        watch,
        formState: {errors},
    } = useForm<Keycard>({
        defaultValues: {
            KeycardId: undefined,
            RfidTag: "",
            EmployeeId: 0,
            IssueDate: "",
            ExpireDate: "",
            StatusTypesId: 1,
            AccessLevels: [],
        },
    });

    const openDialog = () => {
        reset({
            KeycardId: undefined,
            RfidTag: "",
            EmployeeId: 0,
            IssueDate: "",
            ExpireDate: "",
            StatusTypesId: 1,
            AccessLevels: [],
        });
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const onSubmit: SubmitHandler<Keycard> = async (data) => {
        try {
            await addKeycard(data).unwrap();
        } catch (error) {
            console.error(t("keycards.error"), error);
        }
        closeDialog();
    };

    useEffect(() => {
        if (keycards) {
            const grouped = keycards.reduce((acc, keycard) => {
                keycard.AccessLevels.forEach((level) => {
                    if (!acc[level]) {
                        acc[level] = [];
                    }
                    acc[level].push(keycard);
                });
                return acc;
            }, {} as Record<string, Keycard[]>);
            setGroupedKeycards(grouped);
        }
    }, [keycards]);

    return (
        <Box p={8}>
            <Heading mb={8} fontSize="2xl">
                {t("keycards.title")}
            </Heading>

            <Flex justifyContent="end">
                <Button variant="ghost" onClick={openDialog}>
                    {t("keycards.new")}
                </Button>
            </Flex>

            {isKeycardsLoading ? (
                <Spinner size="lg"/>
            ) : (
                <Stack gap="10">
                    {Object.entries(groupedKeycards).sort().map(([accessLevel, keycards]) => (
                        <Box key={accessLevel}>
                            <Heading fontSize="lg" mb={4}>
                                {t(`access_levels.${accessLevel.toLowerCase()}`, accessLevel)}
                            </Heading>
                            <Table.Root size="lg" variant="outline">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>{t("keycards.rfid_tag")}</Table.ColumnHeader>
                                        <Table.ColumnHeader>{t("keycards.employee_id")}</Table.ColumnHeader>
                                        <Table.ColumnHeader>{t("keycards.issue_date")}</Table.ColumnHeader>
                                        <Table.ColumnHeader>{t("keycards.expire_date")}</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end">{t("keycards.status")}</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {keycards.map((keycard) => (
                                        <Table.Row
                                            key={keycard.KeycardId}
                                            onClick={() => navigate(`/dashboard/keycards/${keycard.KeycardId}`)}
                                            style={{cursor: "pointer"}}
                                        >
                                            <Table.Cell>{keycard.RfidTag}</Table.Cell>
                                            <Table.Cell>{keycard.EmployeeId}</Table.Cell>
                                            <Table.Cell>{new Date(keycard.IssueDate).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>{new Date(keycard.ExpireDate).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell textAlign="end">
                                                {t(`status_types.${keycard.StatusTypesId}`)}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    ))}
                </Stack>
            )}

            <DialogRoot open={dialogOpen}>
                <DialogTrigger/>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{t("keycards.add")}</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                <Field label="rfid" invalid={Boolean(errors.RfidTag)} errorText={errors.RfidTag?.message}>
                                    <Input
                                        placeholder={t('keycards.rfid_required')}
                                        borderColor="gray.200"
                                        _dark={{borderColor: 'gray.700'}}
                                        {...register('RfidTag', {required: 'RFID is required'})}
                                    />
                                </Field>

                                <Field label="employee" invalid={Boolean(errors.EmployeeId)} errorText={errors.EmployeeId?.message}>
                                    <select
                                        {...register('EmployeeId', {required: 'Employee is required'})}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderColor: "gray.200",
                                            borderRadius: "4px",
                                            background: "white",
                                        }}
                                    >
                                        {isEmployeesLoading ? (
                                            <option disabled>{t("keycards.loading_employees")}</option>
                                        ) : (
                                            employees?.map((employee) => (
                                                <option key={employee.Id} value={employee.Id}>
                                                    {employee.Firstname} {employee.Lastname}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </Field>

                                <Field label="issue_date" invalid={Boolean(errors.IssueDate)} errorText={errors.IssueDate?.message}>
                                    <Input
                                        type="date"
                                        borderColor="gray.200"
                                        _dark={{borderColor: 'gray.700'}}
                                        {...register('IssueDate')}
                                    />
                                </Field>

                                <Field label="expire_date" invalid={Boolean(errors.ExpireDate)} errorText={errors.ExpireDate?.message}>
                                    <Input
                                        type="date"
                                        borderColor="gray.200"
                                        _dark={{borderColor: 'gray.700'}}
                                        {...register('ExpireDate')}
                                    />
                                </Field>

                                <Field label="status" invalid={Boolean(errors.StatusTypesId)} errorText={errors.StatusTypesId?.message}>
                                    <Checkbox
                                        {...register('StatusTypesId')}
                                        checked={watch('StatusTypesId') !== 2}
                                    >
                                        {t('active')}
                                    </Checkbox>
                                </Field>
                            </VStack>
                        </DialogBody>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeDialog}>
                                {t("cancel")}
                            </Button>
                            <Button type="submit">{t("save")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogRoot>
        </Box>
    );
}
