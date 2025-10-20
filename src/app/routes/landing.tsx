import { Banner } from '@/components/ui/banner';
import { Container, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";
import { FaDoorClosed, FaEye, FaHouse } from 'react-icons/fa6';

export function LandingRoute() {
    const { t } = useTranslation();

    const features = [
        {
            icon: <FaHouse />,
            title: t('landing.inventory'),
            text: t('landing.inventory.description')
        },
        {
            icon: <FaEye />,
            title: t('landing.monitoring'),
            text: t('landing.monitoring.description')
        },
        {
            icon: <FaDoorClosed />,
            title: t('landing.barcode'),
            text: t('landing.barcode.description')
        },
    ];

    return (
        <div>
            <Banner
                imageUrl="/images/gradient4.jpg"
                title={t('landing.welcome')}
                description={t('landing.description')}
                extraText={t('landing.extra_text')}
                features={features}
                size='md'
            />

            <Container className="max-w-4xl mx-auto p-5">
                <Heading size="4xl" mb={4} textAlign="center">{t('landing.about_title')}</Heading>
                <Text fontSize="md" mb={4} textAlign="center">
                    {t('landing.about_description')}
                </Text>
                <Text fontSize="md" mb={4} textAlign="center">
                    {t('landing.about_description2')}
                </Text>
            </Container>

            <Banner
                imageUrl="/images/smart.jpeg"
                title={t('landing.get_started')}
                description={t('landing.get_started_description')}
                size='sm'
                overlayColor="rgba(0, 0, 0, 0.3)"
            />
        </div>
    );
}
