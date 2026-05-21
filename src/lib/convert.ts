export interface ChatGptSession {
  accessToken?: string;
  expires?: string;
  account?: {
    id?: string;
  };
}

export interface CodexAuthJson {
  auth_mode: "chatgpt";
  OPENAI_API_KEY: null;
  tokens: {
    id_token: string;
    access_token: string;
    refresh_token: string;
    account_id: string;
  };
  last_refresh: string;
}

export type ConvertResult =
  | { success: true; data: CodexAuthJson; json: string }
  | { success: false; error: string };

export function convertSessionToAuth(raw: string): ConvertResult {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { success: false, error: "Вставьте JSON сессии ChatGPT" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      success: false,
      error: "Ошибка парсинга. Проверьте валидность исходного JSON.",
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      success: false,
      error: "Неверный формат: ожидается JSON-объект",
    };
  }

  const session = parsed as ChatGptSession;
  const accessToken = session.accessToken;

  if (!accessToken || typeof accessToken !== "string") {
    return {
      success: false,
      error: "Не найден accessToken в JSON сессии",
    };
  }

  const accountId = session.account?.id ?? "";
  if (!accountId) {
    return {
      success: false,
      error: "Не найден account.id в JSON сессии",
    };
  }

  const auth: CodexAuthJson = {
    auth_mode: "chatgpt",
    OPENAI_API_KEY: null,
    tokens: {
      id_token: accessToken,
      access_token: accessToken,
      refresh_token: "rt_",
      account_id: accountId,
    },
    last_refresh: new Date().toISOString(),
  };

  return {
    success: true,
    data: auth,
    json: JSON.stringify(auth, null, 2),
  };
}
