import React, { useState } from 'react';
import { Box, Flex, Input, Text, } from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode.tsx";
import { useTranslation } from "react-i18next";
import { Button } from './button';

export function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
        }
    };

    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.800')}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            width="30vw"
            minW="300px"
            mx="auto"
            mt={10}
            mb={10}
        >
            {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        {t('newsletter.join')}
                    </Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }} mb={4}>
                        {t('newsletter.stay_updated')}
                    </Text>
                    <Flex>
                        <Input
                            type="email"
                            placeholder={t('newsletter.enter_email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            flex="1"
                            mr={2}
                            bg="white"
                            _dark={{ bg: 'gray.700' }}
                        />
                        <Button type="submit">
                            {t('subscribe')}
                        </Button>
                    </Flex>
                </form>
            ) : (
                <Text fontSize="md" color="brand.600" _dark={{ color: "brand.400" }} textAlign="center">
                    {t('newsletter.thank_you')}
                </Text>
            )}
        </Box>
    );
}
