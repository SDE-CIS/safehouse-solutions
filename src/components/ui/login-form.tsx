import React, { useState } from 'react';
import { Box, Center, Flex, Input, Text } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { useSignInMutation } from "@/services/api.ts";
import { Link } from "react-router-dom";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Login } from '@/types/api/Login';
import { Button } from './button';
import { useParallaxBackground } from '@/hooks/useParallaxBackground';

export function LoginForm() {
    const { handleSubmit, register, formState: { errors } } = useForm<Login>();
    const [signIn] = useSignInMutation();
    const [authError, setAuthError] = useState<string | null>(null);
    const [show, setShow] = React.useState(false);
    const { t } = useTranslation();
    const handleShowHidePass = () => setShow(!show);
    const { bgPosition, transition } = useParallaxBackground({ strength: 10 })

    const onSubmit: SubmitHandler<Login> = async (data) => {
        setAuthError(null);

        const res = await signIn(data);
        if (res.error) {
            const status = (res.error as FetchBaseQueryError).status;
            if (status === 401) {
                setAuthError(t('auth.invalid_credentials'));
            }

            return;
        }
    };

    return (
        <Center
            pt={16}
            pb={16}
            bgImage={`url(/images/login.jpg)`}
            bgSize="110%"
            bgPos={bgPosition}
            transition={transition}
            minH="100vh"
        >
            <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                p="8"
                borderRadius="md"
                boxShadow="lg"
                bg="white"
                _dark={{ bg: 'gray.800' }}
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
                        _dark={{ borderColor: 'gray.700' }}
                        {...register('Username', { required: 'Username is required' })}
                    />
                </Field>

                <Field label="auth.password" mt={5} invalid={Boolean(errors.Password)}
                    errorText={errors.Password?.message}>
                    <Box position="relative" width="100%">
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder={t('auth.enter_password')}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                            {...register('Password', { required: 'Password is required' })}
                        />
                        <Button
                            position="absolute"
                            top="50%"
                            right="0"
                            transform="translateY(-50%)"
                            size="sm"
                            variantStyle={"outline"}
                            onClick={handleShowHidePass}
                        >
                            {show ? t('auth.hide') : t('auth.show')}
                        </Button>
                    </Box>
                </Field>

                {/* Submit Button */}
                <Box textAlign="center" mt="6">
                    <Button type="submit" width="100%">
                        {t('auth.login')}
                    </Button>
                </Box>

                {/* Auth Error */}
                {authError && (
                    <Text color="red.500" textAlign="center">
                        {authError}
                    </Text>
                )}

                {/* Secondary Action */}
                <Flex alignItems="center" flexDirection="column" mt="5">
                    <Text pb={2}>{t('auth.no_account')}</Text>
                    <Link to={"/auth/register"}>
                        <Button variantStyle={"reverse"}>
                            {t('auth.register')}
                        </Button>
                    </Link>
                </Flex>
            </Box>
        </Center>
    );
}
