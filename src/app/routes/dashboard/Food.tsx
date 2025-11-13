"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import {
    Box,
    Flex,
    Heading,
    Input,
    Textarea,
    VStack,
    Text,
    HStack,
    Card,
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next"
import { toaster } from "@/components/ui/toaster"
import { useColorModeValue } from "@/components/ui/color-mode"
import { Button } from "@/components/ui/button"

type DayKey =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"

type MealEntry = {
    breakfast: string
    lunch: string
    dinner: string
    notes: string
}

type MealPlan = Record<DayKey, MealEntry>

const STORAGE_KEY = "foodPlanner.v3"

const DEFAULT_PLAN: MealPlan = {
    Monday: { breakfast: "", lunch: "", dinner: "", notes: "" },
    Tuesday: { breakfast: "", lunch: "", dinner: "", notes: "" },
    Wednesday: { breakfast: "", lunch: "", dinner: "", notes: "" },
    Thursday: { breakfast: "", lunch: "", dinner: "", notes: "" },
    Friday: { breakfast: "", lunch: "", dinner: "", notes: "" },
    Saturday: { breakfast: "", lunch: "", dinner: "", notes: "" },
    Sunday: { breakfast: "", lunch: "", dinner: "", notes: "" },
}

function toCSV(plan: MealPlan): string {
    const header = ["Day", "Breakfast", "Lunch", "Dinner", "Notes"]
    const rows = (Object.keys(plan) as DayKey[]).map((day) => [
        day,
        plan[day].breakfast,
        plan[day].lunch,
        plan[day].dinner,
        plan[day].notes,
    ])
    const escape = (s: string) => {
        if (s == null) return ""
        const needsQuotes = /[",\n]/.test(s)
        const escaped = s.replace(/"/g, '""')
        return needsQuotes ? `"${escaped}"` : escaped
    }
    return [header.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n")
}

function splitCSVLine(line: string): string[] {
    const out: string[] = []
    let cur = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') {
                    cur += '"'
                    i++
                } else {
                    inQuotes = false
                }
            } else {
                cur += ch
            }
        } else {
            if (ch === '"') inQuotes = true
            else if (ch === ",") {
                out.push(cur)
                cur = ""
            } else cur += ch
        }
    }
    out.push(cur)
    return out
}

function fromCSV(csvText: string): MealPlan {
    const lines = csvText.trim().split(/\r?\n/)
    if (lines.length < 2) throw new Error("CSV has no data")

    const plan: MealPlan = { ...DEFAULT_PLAN }

    for (let i = 1; i < lines.length; i++) {
        const cols = splitCSVLine(lines[i])
        const [day, breakfast, lunch, dinner, notes] = cols
        if (!day) continue
        if (day in plan) {
            plan[day as DayKey] = {
                breakfast: breakfast || "",
                lunch: lunch || "",
                dinner: dinner || "",
                notes: notes || "",
            }
        }
    }

    return plan
}

function download(filename: string, text: string, mime = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export const FoodRoute = () => {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [plan, setPlan] = useState<MealPlan>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? (JSON.parse(raw) as MealPlan) : DEFAULT_PLAN
        } catch {
            return DEFAULT_PLAN
        }
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    }, [plan])

    const days = useMemo(() => Object.keys(plan) as DayKey[], [plan])

    const handleChange =
        (day: DayKey, field: keyof MealEntry) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setPlan((prev) => ({
                    ...prev,
                    [day]: { ...prev[day], [field]: e.target.value },
                }))
            }

    const handleExportCSV = () => {
        download("meal-plan.csv", toCSV(plan), "text/csv")
        toaster.create({
            title: t("exported_csv"),
            description: t("meal_plan_saved_as_csv"),
        })
    }

    const handleExportJSON = () => {
        download("meal-plan.json", JSON.stringify(plan, null, 2), "application/json")
        toaster.create({
            title: t("exported_json"),
            description: t("meal_plan_saved_as_json"),
        })
    }

    const handleImportClick = () => fileInputRef.current?.click()

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const text = await file.text()
            const imported = text.trim().startsWith("{")
                ? (JSON.parse(text) as MealPlan)
                : fromCSV(text)
            setPlan(imported)
            toaster.create({
                title: t("ui_imported"),
                description: t("meal_plan_imported_successfully"),
            })
        } catch (err: any) {
            toaster.create({
                title: t("import_failed"),
                description: err?.message || t("could_not_import_meal_plan"),
            })
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleClear = () => {
        setPlan(DEFAULT_PLAN)
        toaster.create({
            title: t("cleared"),
            description: t("meal_plan_cleared"),
        })
    }

    const lineColor = useColorModeValue("brand.500", "brand.300")

    return (
        <Box px={{ base: 4, md: 8 }} py={6} maxW="1200px" mx="auto">
            <Flex align="center" mb={8} wrap="wrap" gap={3}>
                <Heading size="lg">{t("weekly_food_planner")}</Heading>
                <Flex ml="auto" gap={2} wrap="wrap">
                    <Button variantStyle="outline" onClick={handleExportCSV}>
                        {t("export_csv")}
                    </Button>
                    <Button variantStyle="outline" onClick={handleExportJSON}>
                        {t("export_json")}
                    </Button>
                    <Button variantStyle="outline" onClick={handleImportClick}>{t("import")}</Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.json"
                        style={{ display: "none" }}
                        onChange={handleImportFile}
                    />
                    <Button colorScheme="red" variantStyle="reverse" onClick={handleClear}>
                        {t("clear")}
                    </Button>
                </Flex>
            </Flex>

            <Text mb={8} color="fg.muted">
                {t("plan_your_meals_for_the_week_here")}
            </Text>

            <VStack align="stretch" gap={6}>
                {days.map((day) => (
                    <Card.Root
                        key={day}
                        bg="bg.surface"
                        borderRadius="xl"
                        boxShadow="md"
                        transition="all 0.25s ease-in-out"
                        _hover={{
                            transform: "scale(1.02)",
                            boxShadow: "xl",
                            bg: useColorModeValue("brand.50", "gray.700"),
                        }}
                    >
                        <Card.Body gap={6}>
                            <Heading size="md" color={lineColor}>
                                {t(day)}
                            </Heading>

                            <Box position="relative" w="full" px={4}>
                                <HStack justify="space-between" align="center" gap={6} flexWrap="wrap">
                                    {(["breakfast", "lunch", "dinner"] as (keyof MealEntry)[]).map((meal) => (
                                        <VStack
                                            key={meal}
                                            align="center"
                                            flex="1"
                                            gap={2}
                                            zIndex={1}
                                            _hover={{ transform: "scale(1.05)" }}
                                            transition="0.2s"
                                        >
                                            <Box
                                                w={4}
                                                h={4}
                                                borderRadius="full"
                                                bg={lineColor}
                                                border="2px solid"
                                                borderColor={useColorModeValue("white", "gray.700")}
                                            />
                                            <Input
                                                placeholder={t(
                                                    meal === "breakfast"
                                                        ? "e_g_oatmeal_fruit"
                                                        : meal === "lunch"
                                                            ? "e_g_sandwich_salad"
                                                            : "e_g_pasta_veggies"
                                                )}
                                                value={plan[day][meal]}
                                                onChange={handleChange(day, meal)}
                                                textAlign="center"
                                                maxW={{ base: "100%", md: "200px" }}
                                            />
                                            <Text fontSize="sm" color="fg.muted">
                                                {t(meal)}
                                            </Text>
                                        </VStack>
                                    ))}
                                </HStack>
                            </Box>

                            <Textarea
                                placeholder={t("groceries_or_notes")}
                                value={plan[day].notes}
                                onChange={handleChange(day, "notes")}
                                rows={3}
                                resize="vertical"
                            />
                        </Card.Body>
                        <Card.Footer justifyContent="flex-end" gap={2}>
                            <Button variant="outline">{t("save")}</Button>
                        </Card.Footer>
                    </Card.Root>
                ))}
            </VStack>
        </Box>
    )
}
