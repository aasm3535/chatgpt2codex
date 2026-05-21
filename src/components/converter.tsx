"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Copy, Download, ExternalLink } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { convertSessionToAuth } from "@/lib/convert";

const SESSION_URL = "https://chatgpt.com/api/auth/session/";
const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ??
  "https://github.com/aasm3535/chatgpt2codex";

export function Converter() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const result = useMemo(() => convertSessionToAuth(input), [input]);
  const output = result.success ? result.json : "";
  const canDownload = result.success;

  async function handleCopy() {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!canDownload) return;

    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "auth.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            ChatGPT → Codex
          </h1>
          <p className="text-sm text-muted-foreground">
            Конвертер сессии ChatGPT в auth.json для Codex CLI
          </p>
        </div>
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          GitHub
        </a>
      </header>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle className="text-lg">Как пользоваться</CardTitle>
          <Collapsible open={instructionsOpen} onOpenChange={setInstructionsOpen}>
            <CollapsibleTrigger className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Инструкция
              <ChevronDown
                className={`size-4 transition-transform ${instructionsOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                1. Полностью закройте приложение Codex (через диспетчер задач).
              </p>
              <p>2. Войдите в нужный аккаунт ChatGPT в браузере.</p>
              <p>
                3. Откройте{" "}
                <a
                  href={SESSION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-foreground underline underline-offset-2 hover:text-primary"
                >
                  {SESSION_URL}
                  <ExternalLink className="size-3" />
                </a>
                , скопируйте весь JSON и вставьте ниже.
              </p>
              <p>
                4. Скачайте auth.json и поместите файл по пути{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  %USERPROFILE%\.codex\auth.json
                </code>{" "}
                (Windows) или{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  ~/.codex/auth.json
                </code>{" "}
                (macOS/Linux).
              </p>
              <p>5. Запустите Codex — аккаунт будет уже авторизован.</p>
            </CollapsibleContent>
          </Collapsible>
          <CardDescription>
            Данные обрабатываются только в браузере и никуда не отправляются.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!result.success && input.trim() ? (
            <Alert variant="destructive">
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <label
              htmlFor="session-input"
              className="text-sm font-medium text-foreground"
            >
              JSON сессии ChatGPT
            </label>
            <Textarea
              id="session-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Вставьте JSON с https://chatgpt.com/api/auth/session/ ..."
              className="min-h-36 font-mono text-sm"
            />
          </div>

          <Button
            className="w-full"
            disabled={!canDownload}
            onClick={handleDownload}
          >
            <Download data-icon="inline-start" />
            Скачать auth.json
          </Button>

          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="auth-output"
                className="text-sm font-medium text-foreground"
              >
                Результат (auth.json)
              </label>
              <Button
                variant="ghost"
                size="sm"
                disabled={!canDownload}
                onClick={handleCopy}
              >
                <Copy data-icon="inline-start" />
                {copied ? "Скопировано" : "Копировать"}
              </Button>
            </div>
            <Textarea
              id="auth-output"
              readOnly
              value={output}
              placeholder="Результат появится здесь после вставки валидного JSON..."
              className="min-h-36 font-mono text-sm text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-xs text-muted-foreground">
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Исходный код на GitHub
        </a>
      </footer>
    </div>
  );
}
