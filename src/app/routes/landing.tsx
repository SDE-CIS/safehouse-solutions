import { Banner } from '@/components/ui/banner';
import { useTranslation } from "react-i18next";
import { FaBarcode, FaEye, FaWarehouse } from 'react-icons/fa6';

export function LandingRoute() {
    const { t } = useTranslation();

    const features = [
        {
            icon: <FaWarehouse />,
            title: t('landing.inventory'),
            text: t('landing.inventory.description')
        },
        {
            icon: <FaEye />,
            title: t('landing.monitoring'),
            text: t('landing.monitoring.description')
        },
        {
            icon: <FaBarcode />,
            title: t('landing.barcode'),
            text: t('landing.barcode.description')
        },
    ];

    return (
        <div>
            <Banner
                imageUrl="/images/gradient_banner.jpg"
                title={t('landing.welcome')}
                description={t('landing.description')}
                extraText={t('landing.extra_text')}
                features={features}
                size='md'
            />
        </div>
    );
}
