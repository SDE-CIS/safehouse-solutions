import { Container, Heading, Stack, Text } from '@chakra-ui/react';
import { Newsletter } from "@/components/ui/newsletter.tsx";
import { useTranslation } from "react-i18next";

export function ContactUsRoute(): JSX.Element {
    const { t } = useTranslation();

    return (
        <Container maxW="container.xl" flex="1" py={10}>
            <Stack gap={8} align="center">
                <Heading as="h1" size="xl" textAlign="center">
                    {t('contact_us.title')}
                </Heading>
                <Text fontSize="lg" textAlign="center" color="gray.600">
                    {t('contact_us.description')}
                </Text>
                <Newsletter />
            </Stack>
        </Container>
    );
}
