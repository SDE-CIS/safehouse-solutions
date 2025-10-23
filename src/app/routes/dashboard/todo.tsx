import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Table,
    Text,
    Textarea,
    Checkbox,
    VisuallyHidden,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { toaster } from "@/components/ui/toaster";

type Todo = {
    id: string;
    title: string;
    notes: string;
    due: string; // ISO date or ""
    done: boolean;
};

const STORAGE_KEY = "todos.v2";

const uid = () => Math.random().toString(36).slice(2, 9);

const download = (filename: string, text: string, mime = "text/plain;charset=utf-8") => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const toCSV = (rows: Todo[]): string => {
    const header = ["Title", "Notes", "Due", "Done"];
    const esc = (s: string) => {
        if (!s) return "";
        const needs = /[",\n]/.test(s);
        const e = s.replace(/"/g, '""');
        return needs ? `"${e}"` : e;
    };
    const lines = rows.map((t) =>
        [t.title, t.notes, t.due, t.done ? "1" : "0"].map(esc).join(",")
    );
    return [header.join(","), ...lines].join("\n");
};

const splitCSVLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (q) {
            if (ch === '"') {
                if (line[i + 1] === '"') { cur += '"'; i++; } else { q = false; }
            } else cur += ch;
        } else {
            if (ch === '"') q = true;
            else if (ch === ",") { out.push(cur); cur = ""; }
            else cur += ch;
        }
    }
    out.push(cur);
    return out;
};

const fromCSV = (csv: string): Todo[] => {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const head = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
    const hasHeader = head.includes("title") && head.includes("notes") && head.includes("due");
    const start = hasHeader ? 1 : 0;
    const out: Todo[] = [];
    for (let i = start; i < lines.length; i++) {
        const [title = "", notes = "", due = "", done = "0"] = splitCSVLine(lines[i]);
        if (!title && !notes) continue;
        out.push({ id: uid(), title, notes, due, done: done === "1" || /^true$/i.test(done) });
    }
    return out;
};

export const TodoRoute = () => {
    const { t } = useTranslation();

    const [todos, setTodos] = useState<Todo[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as Todo[]) : [];
        } catch {
            return [];
        }
    });

    const [newTitle, setNewTitle] = useState("");
    const [newNotes, setNewNotes] = useState("");
    const [newDue, setNewDue] = useState("");

    const fileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos]);

    const addTodo = () => {
        if (!newTitle.trim()) {
            toaster.create({ title: t("please_enter_task_title") });
            return;
        }
        setTodos((prev) => [
            ...prev,
            { id: uid(), title: newTitle.trim(), notes: newNotes.trim(), due: newDue, done: false },
        ]);
        setNewTitle("");
        setNewNotes("");
        setNewDue("");
    };

    const updateTodo = (id: string, patch: Partial<Todo>) =>
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

    const removeTodo = (id: string) =>
        setTodos((prev) => prev.filter((t) => t.id !== id));

    const clearCompleted = () => {
        setTodos((prev) => prev.filter((t) => !t.done));
        toaster.create({ title: t("cleared_completed") });
    };

    const clearAll = () => {
        setTodos([]);
        toaster.create({ title: t("cleared_all_tasks") });
    };

    const exportCSV = () => {
        download("todos.csv", toCSV(todos), "text/csv");
        toaster.create({ title: t("exported_csv") });
    };

    const exportJSON = () => {
        download("todos.json", JSON.stringify(todos, null, 2), "application/json");
        toaster.create({ title: t("exported_json") });
    };

    const onImportClick = () => fileRef.current?.click();
    const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const imported = text.trim().startsWith("{") || text.trim().startsWith("[")
                ? (JSON.parse(text) as Todo[])
                : fromCSV(text);
            const norm = imported.map((i) => ({
                id: uid(),
                title: i.title ?? "",
                notes: i.notes ?? "",
                due: i.due ?? "",
                done: !!i.done,
            }));
            setTodos(norm);
            toaster.create({ title: t("imported_tasks") });
        } catch (err: any) {
            toaster.create({ title: t("import_failed"), description: err?.message || "" });
        } finally {
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const handleToggle = (id: string) => (ev: any) => {
        // new anatomy emits { checked } or a native event; normalize:
        const checked = !!(ev?.checked ?? ev?.target?.checked);
        updateTodo(id, { done: checked });
    };

    return (
        <Box px={{ base: 4, md: 8 }} py={6} maxW="1000px" mx="auto">
            <Flex align="center" gap={4} mb={6} wrap="wrap">
                <Heading size="lg">{t("todo")}</Heading>
                <Text ml="auto" color="fg.muted">
                    {t("remaining")}: {remaining}
                </Text>
                <HStack>
                    <Button variant="outline" onClick={exportCSV}>{t("export_csv")}</Button>
                    <Button variant="outline" onClick={exportJSON}>{t("export_json")}</Button>
                    <Button onClick={onImportClick}>{t("import")}</Button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".csv,.json"
                        style={{ display: "none" }}
                        onChange={onImportFile}
                    />
                    <Button variant="subtle" onClick={clearCompleted}>
                        {t("clear_completed")}
                    </Button>
                    <Button colorPalette="red" variant="ghost" onClick={clearAll}>
                        {t("clear_all")}
                    </Button>
                </HStack>
            </Flex>

            {/* Add row */}
            <Box borderWidth="1px" borderRadius="lg" p={3} mb={4} bg="bg">
                <Flex gap={2} wrap="wrap">
                    <Input
                        flex="2"
                        placeholder={t("what_needs_to_be_done")}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    <Input
                        type="date"
                        flex="1"
                        value={newDue}
                        onChange={(e) => setNewDue(e.target.value)}
                    />
                    <Input
                        flex="2"
                        placeholder={t("short_notes_optional")}
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    <Button onClick={addTodo}>{t("add")}</Button>
                </Flex>
            </Box>

            {/* List */}
            <Table.Root size="md" variant="outline">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader width="64px">{t("done")}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t("task")}</Table.ColumnHeader>
                        <Table.ColumnHeader width="180px">{t("due")}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t("notes")}</Table.ColumnHeader>
                        <Table.ColumnHeader width="56px" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {todos.length === 0 ? (
                        <Table.Row>
                            <Table.Cell colSpan={5} color="fg.muted">
                                {t("no_tasks_yet_add_your_first_one_above")}
                            </Table.Cell>
                        </Table.Row>
                    ) : (
                        todos.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>
                                    {/* NEW CHECKBOX ANATOMY */}
                                    <Checkbox.Root checked={item.done} onCheckedChange={handleToggle(item.id)}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>
                                        {/* Accessible label for the checkbox only (task title is editable next cell) */}
                                        <Checkbox.Label>
                                            <VisuallyHidden>{t("mark_done")}</VisuallyHidden>
                                        </Checkbox.Label>
                                    </Checkbox.Root>
                                </Table.Cell>

                                <Table.Cell>
                                    <Input
                                        value={item.title}
                                        onChange={(e) => updateTodo(item.id, { title: e.target.value })}
                                    />
                                </Table.Cell>

                                <Table.Cell>
                                    <Input
                                        type="date"
                                        value={item.due}
                                        onChange={(e) => updateTodo(item.id, { due: e.target.value })}
                                    />
                                </Table.Cell>

                                <Table.Cell>
                                    <Textarea
                                        value={item.notes}
                                        onChange={(e) => updateTodo(item.id, { notes: e.target.value })}
                                        rows={2}
                                    />
                                </Table.Cell>

                                <Table.Cell>
                                    <IconButton
                                        aria-label={t("delete")}
                                        size="sm"
                                        variant="ghost"
                                        colorPalette="red"
                                        onClick={() => removeTodo(item.id)}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};
