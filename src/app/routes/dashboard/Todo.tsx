"use client"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { bg } from "date-fns/locale"
import { da } from "date-fns/locale"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
    Box,
    Button as ChakraButton,
    Card,
    Checkbox,
    Flex,
    Heading,
    IconButton,
    Input,
    Text,
    Textarea,
    VStack,
    VisuallyHidden,
} from "@chakra-ui/react"
import { Trash2 } from "lucide-react"
import { toaster } from "@/components/ui/toaster"
import { useTranslation } from "react-i18next"
import { useColorModeValue } from "@/components/ui/color-mode"
import i18n from "@/config/i18n"
import { Button } from "@/components/ui/button"

type Todo = {
    id: string
    title: string
    notes: string
    due: string
    done: boolean
}

const STORAGE_KEY = "todos.v3"
const uid = () => Math.random().toString(36).slice(2, 9)

const download = (filename: string, text: string, mime = "text/plain;charset=utf-8") => {
    const blob = new Blob([text], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

const toCSV = (rows: Todo[]): string => {
    const header = ["Title", "Notes", "Due", "Done"]
    const esc = (s: string) => {
        if (!s) return ""
        const needs = /[",\n]/.test(s)
        const e = s.replace(/"/g, '""')
        return needs ? `"${e}"` : e
    }
    const lines = rows.map((t) =>
        [t.title, t.notes, t.due, t.done ? "1" : "0"].map(esc).join(",")
    )
    return [header.join(","), ...lines].join("\n")
}

const fromCSV = (csv: string): Todo[] => {
    const lines = csv.trim().split(/\r?\n/)
    if (lines.length < 2) return []
    const start = lines[0].toLowerCase().includes("title") ? 1 : 0
    return lines.slice(start).map((line) => {
        const [title = "", notes = "", due = "", done = "0"] = line.split(",")
        return {
            id: uid(),
            title,
            notes,
            due,
            done: done === "1" || /^true$/i.test(done),
        }
    })
}

export const TodoRoute = () => {
    const { t } = useTranslation()
    const [todos, setTodos] = useState<Todo[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? (JSON.parse(raw) as Todo[]) : []
        } catch {
            return []
        }
    })

    const [newTitle, setNewTitle] = useState("")
    const [newNotes, setNewNotes] = useState("")
    const [newDue, setNewDue] = useState("")
    const fileRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }, [todos])

    const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos])
    const lineColor = useColorModeValue("brand.500", "brand.300")
    const locale = i18n.language === "bg" ? bg : da

    const addTodo = () => {
        if (!newTitle.trim()) {
            toaster.create({ title: t("please_enter_task_title") })
            return
        }
        setTodos((prev) => [
            ...prev,
            {
                id: uid(),
                title: newTitle.trim(),
                notes: newNotes.trim(),
                due: newDue,
                done: false,
            },
        ])
        setNewTitle("")
        setNewNotes("")
        setNewDue("")
    }

    const updateTodo = (id: string, patch: Partial<Todo>) =>
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

    const removeTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id))
    const clearCompleted = () => {
        setTodos((prev) => prev.filter((t) => !t.done))
        toaster.create({ title: t("cleared_completed") })
    }
    const clearAll = () => {
        setTodos([])
        toaster.create({ title: t("cleared_all_tasks") })
    }

    const exportCSV = () => {
        download("todos.csv", toCSV(todos), "text/csv")
        toaster.create({ title: t("exported_csv") })
    }
    const exportJSON = () => {
        download("todos.json", JSON.stringify(todos, null, 2), "application/json")
        toaster.create({ title: t("exported_json") })
    }

    const onImportClick = () => fileRef.current?.click()
    const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const text = await file.text()
            const imported = text.trim().startsWith("{") || text.trim().startsWith("[")
                ? (JSON.parse(text) as Todo[])
                : fromCSV(text)
            const norm = imported.map((i) => ({
                id: uid(),
                title: i.title ?? "",
                notes: i.notes ?? "",
                due: i.due ?? "",
                done: !!i.done,
            }))
            setTodos(norm)
            toaster.create({ title: t("imported_tasks") })
        } catch (err: any) {
            toaster.create({ title: t("import_failed"), description: err?.message || "" })
        } finally {
            if (fileRef.current) fileRef.current.value = ""
        }
    }

    const handleToggle = (id: string) => (ev: any) => {
        const checked = !!(ev?.checked ?? ev?.target?.checked)
        updateTodo(id, { done: checked })
    }

    return (
        <Box px={{ base: 4, md: 8 }} py={8} maxW="900px" mx="auto">
            <Flex align="center" mb={6} wrap="wrap" gap={3}>
                <Heading size="lg">{t("todo_list")}</Heading>
                <Text ml="auto" color="fg.muted">
                    {t("remaining")}: {remaining}
                </Text>
            </Flex>

            {/* Toolbar */}
            <Flex mb={6} wrap="wrap" gap={2}>
                <Button variantStyle="outline" onClick={exportCSV}>
                    {t("export_csv")}
                </Button>
                <Button variantStyle="outline" onClick={exportJSON}>
                    {t("export_json")}
                </Button>
                <Button onClick={onImportClick}>{t("import")}</Button>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.json"
                    style={{ display: "none" }}
                    onChange={onImportFile}
                />
                <Button variantStyle="reverse" onClick={clearCompleted}>
                    {t("clear_completed")}
                </Button>
                <Button colorScheme="red" variantStyle="reverse" onClick={clearAll}>
                    {t("clear_all")}
                </Button>
            </Flex>

            {/* Add New */}
            <Card.Root
                bg="bg.surface"
                borderRadius="xl"
                boxShadow="md"
                mb={8}
                _hover={{ boxShadow: "xl" }}
            >
                <Card.Body gap={3}>
                    <Heading size="sm" color={lineColor}>
                        {t("add_new_task")}
                    </Heading>
                    <Flex gap={3} wrap="wrap">
                        <Input
                            flex="2"
                            placeholder={t("what_needs_to_be_done")}
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTodo()}
                        />
                        <ChakraButton variant="outline">
                            <DatePicker
                                selected={newDue ? new Date(newDue) : null}
                                onChange={(date: Date | null) => {
                                    if (date) {
                                        setNewDue(date.toISOString().split("T")[0])
                                    } else {
                                        setNewDue("")
                                    }
                                }}
                                placeholderText={t("due_date_optional")}
                                isClearable
                                dateFormat="P"
                                locale={locale}
                            />
                        </ChakraButton>

                        <Input
                            flex="2"
                            placeholder={t("short_notes_optional")}
                            value={newNotes}
                            onChange={(e) => setNewNotes(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTodo()}
                        />
                        <Button onClick={addTodo}>{t("add")}</Button>
                    </Flex>
                </Card.Body>
            </Card.Root>

            {/* Todo list */}
            <VStack align="stretch" gap={4}>
                {todos.length === 0 ? (
                    <Text color="fg.muted">{t("no_tasks_yet_add_your_first_one_above")}</Text>
                ) : (
                    todos.map((todo) => (
                        <Card.Root
                            key={todo.id}
                            borderRadius="lg"
                            boxShadow="base"
                            bg={todo.done ? useColorModeValue("gray.100", "gray.800") : "bg.surface"}
                            transition="0.2s"
                            _hover={{
                                transform: "scale(1.01)",
                                boxShadow: "lg",
                                borderColor: useColorModeValue("brand.200", "brand.600"),
                            }}
                        >
                            <Card.Body gap={3}>
                                <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                                    <Checkbox.Root checked={todo.done} onCheckedChange={handleToggle(todo.id)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control borderColor={lineColor}>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>
                                        <Checkbox.Label>
                                            <VisuallyHidden>{t("mark_done")}</VisuallyHidden>
                                        </Checkbox.Label>
                                    </Checkbox.Root>

                                    <Input
                                        flex="1"
                                        value={todo.title}
                                        fontWeight="medium"
                                        textDecoration={todo.done ? "line-through" : "none"}
                                        onChange={(e) => updateTodo(todo.id, { title: e.target.value })}
                                    />
                                    <Text>
                                        {todo.due &&
                                            new Intl.DateTimeFormat(
                                                i18n.language === "bg" ? "bg-BG" : "en-US",
                                                { year: "numeric", month: "long", day: "numeric" }
                                            ).format(new Date(todo.due))}
                                    </Text>
                                    <IconButton
                                        aria-label={t("delete")}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => removeTodo(todo.id)}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Flex>

                                {todo.notes && (
                                    <>
                                        <Textarea
                                            value={todo.notes}
                                            onChange={(e) => updateTodo(todo.id, { notes: e.target.value })}
                                            rows={2}
                                            resize="vertical"
                                        />
                                    </>
                                )}
                            </Card.Body>
                        </Card.Root>
                    ))
                )}
            </VStack>
        </Box>
    )
}
