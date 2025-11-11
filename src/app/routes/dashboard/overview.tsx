import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    VStack,
    Text,
    Flex,
    Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useActivateFanMutation, useFansQuery, useTemperatureLogsQuery } from "@/services/api";
import { useEffect, useMemo, useState } from "react";
import { Fan, Thermometer, Activity } from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Button } from "@/components/ui/button";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const MotionBox = motion(Box);

type StatCardProps = {
    label: string;
    value: number;
    suffix?: string;
    icon: any;
    color: string;
};

function AnimatedStat({ label, value, suffix, icon, color }: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const iconColor = useColorModeValue("black", "white");

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 700;
        const step = Math.ceil(end / (duration / 16));

        const interval = setInterval(() => {
            start += step;
            if (start >= end) {
                start = end;
                clearInterval(interval);
            }
            setDisplayValue(start);
        }, 16);

        return () => clearInterval(interval);
    }, [value]);

    return (
        <MotionBox
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            borderRadius="lg"
            p={6}
            bgGradient={`linear(to-br, ${color}, ${useColorModeValue(
                "gray.100",
                "gray.700"
            )})`}
            shadow="lg"
        >
            <Flex justify="space-between" align="center">
                <VStack align="start" gap={1}>
                    <Text fontSize="sm" color="gray.200" _light={{ color: "gray.600" }}>
                        {label}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="white" _light={{ color: "gray.800" }}>
                        {displayValue}
                        {suffix}
                    </Text>
                </VStack>
                <Icon as={icon} boxSize={8} opacity={0.9} color={iconColor} />
            </Flex>
        </MotionBox>
    );
}

export function OverviewRoute() {
    const userId = cookies.get("id");
    const { t } = useTranslation();
    const { data: fansData, error: _fansError, isLoading: _fansLoading, isError: _fansIsError, refetch: fansRefetch } = useFansQuery(userId, {
        pollingInterval: 5000,
    });
    const { data: tempsData, error: _tempsError, isLoading: _tempsLoading, isError: _tempsIsError } = useTemperatureLogsQuery();
    const [activateFan] = useActivateFanMutation();

    const fans = fansData?.data ?? [];
    const temps = tempsData?.data ?? [];

    const stats = useMemo(() => {
        if (!fans.length || !temps.length) {
            return { totalFans: 0, fansOn: 0, avgFanSpeed: 0, avgTemperature: 0, lastTemperature: 0 };
        }

        const fansOn = fans.filter((f) => f.fanMode === "on").length;
        const avgTemperature = temps.reduce((a, t) => a + t.Temperature, 0) / temps.length;
        const lastTemperature = temps[temps.length - 1]?.Temperature ?? 0;

        return {
            totalFans: fans.length,
            fansOn,
            avgTemperature: Math.round(avgTemperature),
            lastTemperature,
        };
    }, [fans, temps]);

    const chartData = temps.slice(-20).map((t) => ({
        time: new Date(t.TemperatureTimestamp).toLocaleTimeString(),
        temperature: t.Temperature,
    }));

    const chartBg = useColorModeValue("gray.100", "gray.800");
    const fanCardBg = useColorModeValue("white", "gray.900");
    const tooltipBg = useColorModeValue("#fff", "#1a202c");

    const onFanActivate = (fanId: number, mode: string) => {
        activateFan({
            UserID: 1,
            DeviceID: fanId,
            Location: "stue",
            FanMode: mode
        });
        setTimeout(() => { fansRefetch() }, 1500);
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="xl" mb={8} textAlign="center">
                {t("dashboard.title")}
            </Heading>

            {/* STAT CARDS */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} gap={6} mb={10}>
                <AnimatedStat label={t("total_fans")} value={stats.totalFans} icon={Activity} color="purple.500" />
                <AnimatedStat label={t("fans_on")} value={stats.fansOn} icon={Fan} color="teal.500" />
                <AnimatedStat label={t("avg_temperature")} value={stats.avgTemperature} suffix="°C" icon={Thermometer} color="orange.400" />
                <AnimatedStat label={t("last_temperature")} value={stats.lastTemperature} suffix="°C" icon={Thermometer} color="red.400" />
            </SimpleGrid>

            {/* TEMPERATURE CHART */}
            <Box
                borderWidth="1px"
                borderRadius="xl"
                p={6}
                mb={10}
                bg={chartBg}
                shadow="lg"
            >
                <Heading size="md" mb={4}>
                    {t("temperature_trend")}
                </Heading>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="10%"
                                        stopColor={
                                            stats.lastTemperature > 25
                                                ? "#f56565"
                                                : "#4299E1"
                                        }
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="90%"
                                        stopColor={
                                            stats.lastTemperature > 25
                                                ? "#f56565"
                                                : "#4299E1"
                                        }
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                unit="°C"
                                domain={["dataMin - 2", "dataMax + 2"]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: "none",
                                    borderRadius: "8px",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="temperature"
                                stroke={
                                    stats.lastTemperature > 25 ? "#f56565" : "#4299E1"
                                }
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorTemp)"
                                animationDuration={700}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <Text textAlign="center" color="gray.500">
                        {t("no_temperature_data")}
                    </Text>
                )}
            </Box>

            {/* FANS OVERVIEW */}
            <Heading as="h2" size="md" mb={6}>
                {t("fans_overview")}
            </Heading>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
                {fans.map((fan) => (
                    <MotionBox
                        key={fan.ID}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={5}
                        bg={fanCardBg}
                        shadow="sm"
                        whileHover={{ y: -5, boxShadow: "xl" }}
                        transition={{ duration: 0.2 }}
                    >
                        <Flex justify="space-between" align="center" mb={3}>
                            <Text fontWeight="bold">
                                Fan #{fan.ID} – #{fan.UserID}
                            </Text>
                            <Button
                                px={3}
                                py={1}
                                borderRadius="md"
                                bg={fan.fanMode === "on" ? "green.400" : "gray.600"}
                                color="white"
                                fontSize="xs"
                                onClick={() =>
                                    onFanActivate(
                                        fan.UserID,
                                        fan.fanMode === "on" ? "off" : "on"
                                    )
                                }
                            >
                                {fan.fanMode === "on" ? t("on") : t("off")}
                            </Button>
                        </Flex>
                        <VStack align="start" gap={1}>
                            <Text fontSize="sm">
                                <strong>{t("mode")}:</strong> {fan.fanMode}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {new Date(fan.DateAdded ?? "").toLocaleString()}
                            </Text>
                        </VStack>
                    </MotionBox>
                ))}
            </SimpleGrid>
        </Container>
    );
}
