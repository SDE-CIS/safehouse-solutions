import { useState } from 'react';
import {
    Box,
    Button,
    Center,
    Field,
    FieldHelperText,
    Flex,
    Input,
    Text
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Register } from '@/types/api/Register';
import { useCreateUserMutation } from '@/services/api';

export function RegisterForm() {
    const { handleSubmit, register, formState: { errors }, watch } = useForm<Register>();
    const [createUser] = useCreateUserMutation();
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 }); // percentage-based

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth) * 100;
        const y = (e.clientY / innerHeight) * 100;

        // Move slightly around the center
        const offsetX = 50 + (x - 50) / 10;
        const offsetY = 50 + (y - 50) / 10;

        setBgPosition({ x: offsetX, y: offsetY });
    };

    const onSubmit: SubmitHandler<Register> = async (_data) => {
        try {
            const response = await createUser(_data);
            if ('error' in response) {
                const status = (response.error as any).status;
                if (status === 409) {
                    setAuthError('Username or email already exists.');
                } else {
                    setAuthError('An unexpected error occurred. Please try again.');
                }
                return;
            }
            setAuthError(null);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Unexpected error:', err);
            setAuthError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <Center
            pt={16}
            pb={16}
            onMouseMove={handleMouseMove}
            bgImage={`url(/images/space.jpeg)`}
            bgSize="110%"
            bgPos={`${bgPosition.x}% ${bgPosition.y}%`}
            transition="background-position 0.2s ease-out"
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
                maxW="600px"
            >
                <Text fontSize="2xl" fontWeight="bold" mb="6" textAlign="center">
                    {t('auth.register')}
                </Text>

                {/* First + Last Name Row */}
                <Flex gap={4}>
                    <Field.Root invalid={Boolean(errors.FirstName)} flex="1">
                        <Field.Label>{t('auth.first_name')}</Field.Label>
                        <Input
                            placeholder={t('auth.enter_first_name')}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                            {...register('FirstName', { required: 'First Name is required' })}
                        />
                        {errors.FirstName && <Field.ErrorText>{errors.FirstName.message}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={Boolean(errors.LastName)} flex="1">
                        <Field.Label>{t('auth.last_name')}</Field.Label>
                        <Input
                            placeholder={t('auth.enter_last_name')}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                            {...register('LastName', { required: 'Last Name is required' })}
                        />
                        {errors.LastName && <Field.ErrorText>{errors.LastName.message}</Field.ErrorText>}
                    </Field.Root>
                </Flex>

                {/* Username */}
                <Field.Root mt={5} invalid={Boolean(errors.Username)}>
                    <Field.Label>{t('auth.username')}</Field.Label>
                    <Input
                        placeholder={t('auth.enter_username')}
                        borderColor="gray.200"
                        _dark={{ borderColor: 'gray.700' }}
                        {...register('Username', { required: 'Username is required' })}
                    />
                    {errors.Username && <Field.ErrorText>{errors.Username.message}</Field.ErrorText>}
                </Field.Root>

                {/* Email */}
                <Field.Root mt={5} invalid={Boolean(errors.Email)}>
                    <Field.Label>{t('auth.email')}</Field.Label>
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
                    {errors.Email && <Field.ErrorText>{errors.Email.message}</Field.ErrorText>}
                </Field.Root>

                {/* Password */}
                <Field.Root mt={5} invalid={Boolean(errors.Password)}>
                    <Field.Label>{t('auth.password')}</Field.Label>
                    <Box position="relative" width="100%">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('auth.enter_password')}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                            {...register('Password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
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
                    {errors.Password && <Field.ErrorText>{errors.Password.message}</Field.ErrorText>}
                </Field.Root>

                {/* Confirm Password */}
                <Field.Root mt={5} invalid={Boolean(errors.ConfirmPassword)}>
                    <Field.Label>{t('auth.confirm_password')}</Field.Label>
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
                    {errors.ConfirmPassword && <Field.ErrorText>{errors.ConfirmPassword.message}</Field.ErrorText>}
                </Field.Root>

                {/* Submit */}
                <Box textAlign="center" mt="6">
                    <Button type="submit" bg="brand.600" _hover={{ bg: 'brand.400' }} width="100%" color="white">
                        {t('auth.register')}
                    </Button>
                </Box>

                <Field.Root mt={4}>
                    {/* Auth Error */}
                    {authError && (
                        <FieldHelperText color="red.500" mt={3}>
                            {authError}
                        </FieldHelperText>
                    )}
                </Field.Root>

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
