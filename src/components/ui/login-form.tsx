import React, {useState} from 'react';
import {Box, Button, Center, FieldHelperText, Flex, Input, Text} from '@chakra-ui/react';
import {Field} from '@/components/ui/field';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useTranslation} from "react-i18next";
import {Login} from "@/types/api.ts";
import {useSignInMutation} from "@/services/api.ts";
import {Link} from "react-router-dom";

export function LoginForm() {
    const {handleSubmit, register, formState: {errors}} = useForm<Login>();
    const [signIn] = useSignInMutation();
    const [authError, setAuthError] = useState<string | null>(null);
    const [show, setShow] = React.useState(false);
    const {t} = useTranslation();

    const handleShowHidePass = () => setShow(!show);

    const onSubmit: SubmitHandler<Login> = async (data) => {
        try {
            signIn(data);
            setAuthError(null);
        } catch (error: any) {
            if (error.status === 401) {
                setAuthError('Unauthorized: Incorrect username or password.');
            } else {
                setAuthError('An unexpected error occurred. Please try again.');
            }
            console.error(error);
        }
    };

    return (
        <Center h="75vh">
            <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                p="8"
                borderRadius="md"
                boxShadow="lg"
                bg="white"
                _dark={{bg: 'gray.800'}}
                width="100%"
                maxW="400px"
            >
                <Text fontSize="2xl" fontWeight="bold" mb="6" textAlign="center">
                    {t('auth.login')}
                </Text>

                <Field label="auth.username" invalid={Boolean(errors.Username)} errorText={errors.Username?.message}>
                    <Input
                        placeholder={t('auth.enter_username')}
                        borderColor="gray.200"
                        _dark={{borderColor: 'gray.700'}}
                        {...register('Username', {required: 'Username is required'})}
                    />
                </Field>

                <Field label="auth.password" mt={5} invalid={Boolean(errors.Password)}
                       errorText={errors.Password?.message}>
                    <Box position="relative" width="100%">
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder={t('auth.enter_password')}
                            borderColor="gray.200"
                            _dark={{borderColor: 'gray.700'}}
                            {...register('Password', {required: 'Password is required'})}
                        />
                        <Button
                            position="absolute"
                            top="50%"
                            right="10px"
                            transform="translateY(-50%)"
                            size="sm"
                            variant="ghost"
                            onClick={handleShowHidePass}
                        >
                            {show ? t('auth.hide') : t('auth.show')}
                        </Button>
                    </Box>
                </Field>

                {/* Submit Button */}
                <Box textAlign="center" mt="6">
                    <Button type="submit" bg="brand.600" _hover={{bg: 'brand.400'}} width="100%" color="white">
                        {t('auth.login')}
                    </Button>
                </Box>

                {/* Auth Error */}
                {authError && (
                    <FieldHelperText color="red.500" textAlign="center">
                        {authError}
                    </FieldHelperText>
                )}

                {/* Secondary Action */}
                <Flex alignItems="center" flexDirection="column" mt="5">
                    <Text pb={2}>{t('auth.no_account')}</Text>
                    <Button variant="ghost">
                        <Link to={"/auth/register"}>
                            {t('auth.register')}
                        </Link>
                    </Button>
                </Flex>
            </Box>
        </Center>
    );
}
