# ChatGPT → Codex

Конвертер JSON-сессии ChatGPT в `auth.json` для [Codex CLI](https://developers.openai.com/codex/).

## Использование

1. Войдите в ChatGPT в браузере.
2. Откройте [https://chatgpt.com/api/auth/session/](https://chatgpt.com/api/auth/session/) и скопируйте JSON.
3. Вставьте JSON на сайте и скачайте `auth.json`.
4. Положите файл в `~/.codex/auth.json` (или `%USERPROFILE%\.codex\auth.json` на Windows).

## Локальный запуск

```bash
npm install
npm run dev
```

## Стек

- Next.js 16
- Tailwind CSS 4
- shadcn/ui

Вся конвертация выполняется в браузере — данные не отправляются на сервер.
