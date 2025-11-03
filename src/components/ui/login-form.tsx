import { useState } from 'react';
import { Box, Center, Flex, Input, Text, Spinner } from '@chakra-ui/react';
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
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { bgPosition, transition } = useParallaxBackground({ strength: 10 });

    const handleShowHidePass = () => setShow(!show);

    const onSubmit: SubmitHandler<Login> = async (data) => {
        setAuthError(null);
        setLoading(true);

        const res = await signIn(data);
        setLoading(false);

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
                        disabled={loading}
                        {...register('Username', { required: t('auth.username_required') })}
                    />
                </Field>

                <Field
                    label="auth.password"
                    mt={5}
                    invalid={Boolean(errors.Password)}
                    errorText={errors.Password?.message}
                >
                    <Box position="relative" width="100%">
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder={t('auth.enter_password')}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                            disabled={loading}
                            {...register('Password', { required: t('auth.password_required') })}
                        />
                        <Button
                            position="absolute"
                            top="50%"
                            right="0"
                            transform="translateY(-50%)"
                            size="sm"
                            variantStyle={"outline"}
                            onClick={handleShowHidePass}
                            type="button"
                            disabled={loading}
                        >
                            {show ? t('auth.hide') : t('auth.show')}
                        </Button>
                    </Box>
                </Field>

                {/* Submit Button */}
                <Box textAlign="center" mt="6">
                    <Button type="submit" width="100%" disabled={loading}>
                        {loading ? (
                            <Flex align="center" justify="center" gap={2}>
                                <Spinner size="sm" />
                                {t('auth.logging_in')}
                            </Flex>
                        ) : (
                            t('auth.login')
                        )}
                    </Button>
                </Box>

                {/* Auth Error */}
                {authError && (
                    <Text color="red.500" textAlign="center" mt={3}>
                        {authError}
                    </Text>
                )}

                {/* Secondary Action */}
                <Flex alignItems="center" flexDirection="column" mt="5">
                    <Text pb={2}>{t('auth.no_account')}</Text>
                    <Link to={"/auth/register"}>
                        <Button variantStyle={"reverse"} disabled={loading}>
                            {t('auth.register')}
                        </Button>
                    </Link>
                </Flex>
            </Box>
        </Center>
    );
}
