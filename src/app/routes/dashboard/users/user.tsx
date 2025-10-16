import {useEffect, useState} from "react";
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
    VStack
} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useEditUserMutation, useRolesQuery, useUserQuery} from "@/services/api";
import {User} from "@/types/api";
import {Button} from "@/components/ui/button.tsx";
import {Field} from "@/components/ui/field.tsx";

export function UserRoute() {
    const {userId} = useParams<{ userId: string }>();
    const {data: userData, error, isLoading} = useUserQuery(Number(userId));
    const {data: roleData} = useRolesQuery();
    const [editUser] = useEditUserMutation();

    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm<User>({
        defaultValues: {
            Id: 0,
            Username: "",
            ProfilePicture: "",
            Roles: [],
        },
    });

    useEffect(() => {
        if (userData) {
            reset(userData);
            setSelectedRoles(userData.Roles || []);
        }
    }, [userData, reset]);

    const roles = createListCollection({
        items: roleData?.map((role) => ({label: role.Name, value: role.Name})) || [],
    });

    const onSubmit: SubmitHandler<User> = async (data) => {
        try {
            await editUser({...data, Roles: selectedRoles}).unwrap();
            alert("User updated successfully!");
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user.");
        }
    };

    if (isLoading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl"/>
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Box textAlign="center" mt={10}>
                <Heading size="lg" color="red.500">
                    Failed to load user data.
                </Heading>
            </Box>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={8} fontSize="2xl">
                Edit User
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={4} align="stretch">
                    <Field label="username" invalid={Boolean(errors.Username)} errorText={errors.Username?.message}>
                        <Input
                            placeholder="Enter username"
                            borderColor="gray.200"
                            _dark={{borderColor: "gray.700"}}
                            {...register("Username", {required: "Username is required"})}
                        />
                    </Field>

                    <Field label="profile_picture" invalid={Boolean(errors.ProfilePicture)}
                           errorText={errors.ProfilePicture?.message}>
                        <Input
                            placeholder="Enter profile picture URL"
                            borderColor="gray.200"
                            _dark={{borderColor: "gray.700"}}
                            {...register("ProfilePicture", {
                                required: "Profile picture URL is required",
                            })}
                        />
                    </Field>

                    <Controller
                        name="Roles"
                        control={control}
                        render={({field: {value, onChange}}) => (
                            <SelectRoot
                                collection={roles}
                                size="sm"
                                value={value || []}
                                onValueChange={(selectedDetails) => {

                                    console.log(selectedDetails.value[0]);

                                    const selectedValues = Array.isArray(selectedDetails)
                                        ? selectedDetails.map((detail) => detail.value)
                                        : [];
                                    const roleIds = selectedValues.map((id) =>
                                        roleData?.find((role) => role.Id.toString() === id)?.Id.toString() || ""
                                    );

                                    setSelectedRoles((selected) => {
                                        if (selected.includes(selectedDetails.value[0])) {
                                            return selected.filter((role) => role !== selectedDetails.value[0]);
                                        }
                                        return [...selected, selectedDetails.value[0]];
                                    });

                                    onChange(roleIds);
                                }}
                                multiple
                            >
                                <SelectTrigger>
                                    {selectedRoles?.length ? selectedRoles.join(", ") : "None"}
                                </SelectTrigger>
                                <SelectContent position="absolute" mt={10}>
                                    {roles.items.map((role) => (
                                        <SelectItem item={role} key={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectRoot>
                        )}
                    />

                    <VStack gap={4} pt={4}>
                        <Button type="submit" colorScheme="blue">
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                reset(userData);
                                setSelectedRoles(userData.Roles || []);
                            }}
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
