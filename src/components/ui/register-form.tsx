import { useState } from 'react';
import { Box, Button, Center, FieldHelperText, Flex, Input, Text } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { Register } from "@/types/api.ts";
import { Link } from "react-router-dom";

export function RegisterForm() {
    const { handleSubmit, register, formState: { errors }, watch } = useForm<Register>();
    // const [signUp] = useSignUpMutation();
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();

    const onSubmit: SubmitHandler<Register> = async (_data) => {
        try {
            // await signUp(data).unwrap();
            setAuthError(null);
        } catch (error: any) {
            if (error.status === 409) {
                setAuthError('Username or email already exists.');
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
                _dark={{ bg: 'gray.800' }}
                width="100%"
                maxW="400px"
            >
                <Text fontSize="2xl" fontWeight="bold" mb="6" textAlign="center">
                    {t('auth.register')}
                </Text>

                {/* Name Field */}
                <Field label={t('auth.name')} invalid={Boolean(errors.Name)} errorText={errors.Name?.message}>
                    <Input
                        placeholder={t('auth.enter_name')}
                        borderColor="gray.200"
                        _dark={{ borderColor: 'gray.700' }}
                        {...register('Name', { required: 'Name is required' })}
                    />
                </Field>

                {/* Username Field */}
                <Field label={t('auth.username')} mt={5} invalid={Boolean(errors.Username)} errorText={errors.Username?.message}>
                    <Input
                        placeholder={t('auth.enter_username')}
                        borderColor="gray.200"
                        _dark={{ borderColor: 'gray.700' }}
                        {...register('Username', { required: 'Username is required' })}
                    />
                </Field>

                {/* Email Field */}
                <Field label={t('auth.email')} mt={5} invalid={Boolean(errors.Email)} errorText={errors.Email?.message}>
                    <Input
                        type="email"
                        placeholder={t('auth.enter_email')}
                        borderColor="gray.200"
                        _dark={{ borderColor: 'gray.700' }}
                        {...register('Email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                </Field>

                {/* Password Field */}
                <Field label={t('auth.password')} mt={5} invalid={Boolean(errors.Password)} errorText={errors.Password?.message}>
                    <Box position="relative" width="100%">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('auth.enter_password')}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                            {...register('Password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                        />
                        <Button
                            position="absolute"
                            top="50%"
                            right="10px"
                            transform="translateY(-50%)"
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? t('auth.hide') : t('auth.show')}
                        </Button>
                    </Box>
                </Field>

                {/* Confirm Password Field */}
                <Field label={t('auth.confirm_password')} mt={5} invalid={Boolean(errors.ConfirmPassword)} errorText={errors.ConfirmPassword?.message}>
                    <Box position="relative" width="100%">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder={t('auth.enter_confirm_password')}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                            {...register('ConfirmPassword', {
                                required: 'Please confirm your password',
                                validate: (val: string) => {
                                    if (watch('Password') !== val) {
                                        return 'Your passwords do not match';
                                    }
                                }
                            })}
                        />
                        <Button
                            position="absolute"
                            top="50%"
                            right="10px"
                            transform="translateY(-50%)"
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? t('auth.hide') : t('auth.show')}
                        </Button>
                    </Box>
                </Field>

                {/* Submit Button */}
                <Box textAlign="center" mt="6">
                    <Button type="submit" bg="brand.600" _hover={{ bg: 'brand.400' }} width="100%" color="white">
                        {t('auth.register')}
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
                    <Text pb={2}>{t('auth.already_have_account')}</Text>
                    <Button variant="ghost">
                        <Link to={"/auth/login"}>
                            {t('auth.login')}
                        </Link>
                    </Button>
                </Flex>
            </Box>
        </Center>
    );
}
