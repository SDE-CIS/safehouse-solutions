import { Container, Heading, Stack, Text } from '@chakra-ui/react';
import { Newsletter } from "@/components/ui/newsletter.tsx";
import { useTranslation } from "react-i18next";
import { Banner } from '@/components/ui/banner';

export function ContactUsRoute(): JSX.Element {
    const { t } = useTranslation();

    return (
        <>
            <Banner
                imageUrl="/images/privacy-policy.jpg"
                title={t('contact_us.title')}
                description={t('contact_us.description')}
                size='sm'
                overlayColor="rgba(0, 0, 0, 0.3)"
            />

            <Container py={10}>
                <Stack gap={8} align="center">
                    <Heading as="h1" size="xl" textAlign="center">
                        {t('contact_us.intro_title')}
                    </Heading>
                    <Text fontSize="lg" textAlign="center" color="gray.600">
                        {t('contact_us.intro_description')}
                    </Text>
                    <Newsletter />
                </Stack>

            </Container>
        </>
    );
}
