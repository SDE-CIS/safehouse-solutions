"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    Box,
    Heading,
    Spinner,
    Stack,
    Table,
    VStack,
    Input,
    Flex,
    Kbd,
    ActionBarRoot,
    ActionBarContent,
    ActionBarSelectionTrigger,
    ActionBarSeparator,
    Container,
} from "@chakra-ui/react";
import {
    useAddProductMutation,
    useDeleteProductMutation,
    useEditProductMutation,
    useProductsQuery,
} from "@/services/api";
import { Product } from "@/types/api";
import { FiEdit } from "react-icons/fi";
import {
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox.tsx";

export function PimRoute() {
    const { t } = useTranslation();
    const { data: products, isLoading } = useProductsQuery();
    const [addProduct] = useAddProductMutation();
    const [editProduct] = useEditProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [productMode, setProductMode] = useState<"add" | "edit">("add");
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const [selection, setSelection] = useState<number[]>([]);

    const hasSelection = selection.length > 0;
    const indeterminate =
        hasSelection &&
        selection.length < (products != null ? products.length : 0);

    const {
        handleSubmit,
        register,
        reset,
        watch,
        formState: { errors },
    } = useForm<Product>({
        defaultValues: {
            Id: 0,
            Name: "",
            Description: "",
            Price: 0,
            Categories: [],
        },
    });

    const openAddDialog = () => {
        setProductMode("add");
        reset({
            Id: undefined,
            Name: "",
            Description: "",
            Price: 0,
            Categories: [],
            Active: 1,
        });
        setDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setProductMode("edit");
        setCurrentProduct(product);
        reset(product);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setCurrentProduct(null);
    };

    const onSubmit: SubmitHandler<Product> = async (data) => {
        if (productMode === "add") {
            try {
                await addProduct(data).unwrap();
            } catch (error) {
                console.error(t("pim.error"), error);
            }
        } else if (productMode === "edit" && currentProduct) {
            try {
                await editProduct({ ...currentProduct, ...data }).unwrap();
            } catch (error) {
                console.error(t("pim.error"), error);
            }
        }
        closeDialog();
    };

    const onDelete = () => {
        selection.forEach(async (id) => {
            try {
                await deleteProduct(id).unwrap();
            } catch (error) {
                console.error(t("pim.error"), error);
            }
        });

        setSelection([]);
    };

    return (
        <Box p={8}>
            <Heading mb={8} fontSize="2xl">
                {t("pim.title")}
            </Heading>

            <Flex justifyContent="end">
                <Button variant="ghost" onClick={openAddDialog}>
                    {t("pim.new_product")}
                </Button>
            </Flex>

            <DialogRoot open={dialogOpen}>
                <DialogTrigger />
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>
                                {productMode === "add"
                                    ? t("pim.add_product")
                                    : t("pim.edit_product")}
                            </DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                <Field
                                    label="name"
                                    invalid={Boolean(errors.Name)}
                                    errorText={errors.Name?.message}
                                >
                                    <Input
                                        placeholder={t("pim.name_required")}
                                        borderColor="gray.200"
                                        _dark={{ borderColor: "gray.700" }}
                                        {...register("Name", {
                                            required: "Name is required",
                                        })}
                                    />
                                </Field>

                                <Field
                                    label="description"
                                    invalid={Boolean(errors.Description)}
                                    errorText={errors.Description?.message}
                                >
                                    <Input
                                        placeholder={t(
                                            "pim.description_required"
                                        )}
                                        borderColor="gray.200"
                                        _dark={{ borderColor: "gray.700" }}
                                        {...register("Description", {
                                            required: "Description is required",
                                        })}
                                    />
                                </Field>

                                <Field
                                    label="category"
                                    invalid={Boolean(errors.Categories)}
                                    errorText={errors.Categories?.message}
                                >
                                    <Input
                                        placeholder={t("pim.select_categories")}
                                        borderColor="gray.200"
                                        _dark={{ borderColor: "gray.700" }}
                                        {...register("Categories")}
                                    />
                                </Field>

                                <Field
                                    label="price"
                                    invalid={Boolean(errors.Price)}
                                    errorText={errors.Price?.message}
                                >
                                    <Input
                                        placeholder={t("pim.price_required")}
                                        type="number"
                                        borderColor="gray.200"
                                        _dark={{ borderColor: "gray.700" }}
                                        {...register("Price", {
                                            valueAsNumber: true,
                                            validate: (value) =>
                                                value > 0 ||
                                                "Price must be greater than 0",
                                        })}
                                    />
                                </Field>

                                <Field
                                    label="active"
                                    invalid={Boolean(errors.Active)}
                                    errorText={errors.Active?.message}
                                >
                                    <Checkbox
                                        {...register("Active")}
                                        checked={!!watch("Active")}
                                    >
                                        {t("pim.active_product")}
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

            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <Stack gap="10">
                    <Table.Root size="lg" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader w="6">
                                    <Checkbox
                                        top="1"
                                        aria-label="Select all rows"
                                        checked={
                                            indeterminate
                                                ? "indeterminate"
                                                : selection.length > 0
                                        }
                                        onCheckedChange={(changes) => {
                                            setSelection(
                                                changes.checked
                                                    ? products?.map(
                                                          (item) => item.Id
                                                      ) ?? []
                                                    : []
                                            );
                                        }}
                                    />
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    {t("id")}
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    {t("name")}
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    {t("categories")}
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    {t("price")}
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {products?.map((product) => (
                                <Table.Row
                                    key={product.Id}
                                    color={product.Active ? "" : "brand.500"}
                                >
                                    <Table.Cell>
                                        <Checkbox
                                            top="1"
                                            aria-label="Select row"
                                            checked={selection.includes(
                                                product.Id
                                            )}
                                            onCheckedChange={(changes) => {
                                                setSelection((prev) =>
                                                    changes.checked
                                                        ? [...prev, product.Id]
                                                        : selection.filter(
                                                              (id) =>
                                                                  id !==
                                                                  product.Id
                                                          )
                                                );
                                            }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{product.Id}</Table.Cell>
                                    <Table.Cell>{product.Name}</Table.Cell>
                                    <Table.Cell>
                                        {product.Categories}
                                    </Table.Cell>
                                    <Table.Cell>{`${product.Price} DKK`}</Table.Cell>
                                    <Table.Cell textAlign="end">
                                        <FiEdit
                                            size="20px"
                                            cursor="pointer"
                                            onClick={() =>
                                                openEditDialog(product)
                                            }
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>

                    <Container
                        position="fixed"
                        bottom="16px"
                        left="16px"
                        right="16px"
                        zIndex="overlay"
                    >
                        <ActionBarRoot open={hasSelection}>
                            <ActionBarContent>
                                <ActionBarSelectionTrigger>
                                    {selection.length} Products
                                </ActionBarSelectionTrigger>
                                <ActionBarSeparator />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onDelete}
                                >
                                    Delete <Kbd>⌫</Kbd>
                                </Button>
                            </ActionBarContent>
                        </ActionBarRoot>
                    </Container>
                </Stack>
            )}
        </Box>
    );
}
