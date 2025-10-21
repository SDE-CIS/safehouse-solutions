export interface BannerProps {
    imageUrl: string;
    title: string
    description: string;
    extraText?: string;
    features?: any;
    overlayColor?: string;
    size?: 'sm' | 'md' | 'lg';
    typing?: boolean;
}
