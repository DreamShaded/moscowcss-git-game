# CSS Rescue Squad

Интерактивная игра для middle-фронтендеров на знание `git`. Drag-and-drop puzzle: собираешь правильную последовательность команд из банка, тушишь очередной пожар команды «Cascadia».

## Запуск

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production-сборка в dist/
npm run preview      # отдать готовый dist локально
```

Игра — **static-first**. После `npm run build` директория `dist/` целиком автономна:
никаких сетевых запросов в рантайме, никаких внешних CDN. Можно открыть с локальной
директории или раздать с любого LAN-сервера.

## Структура

```
content/
├── tasks/              # YAML на задачу (L1..H10)
├── knowledge/          # MD-страницы базы знаний
└── schema/             # JSON Schema для валидации задач

scripts/
└── build-content.ts    # YAML → src/generated/{content,knowledge}.json + валидация

src/
├── app/                # router + session-context
├── engine/             # checker, scoring, session-store
├── components/         # chip, slot, result panel
├── pages/              # task-select, task-play, docs/*
└── styles/             # global.css (terminal dark)
```

## Контент

Каждая задача описана в одном YAML-файле. Build-time скрипт:

1. парсит все `content/tasks/*.yaml`,
2. валидирует JSON Schema'ой (`content/schema/task-schema.json`),
3. сверяет `points` со `difficulty` (easy=1, medium=3, hard=7),
4. проверяет что каждый шаг `validSolutions` физически собираем из `bank`,
5. проверяет что `relatedKnowledge` ссылается на существующие knowledge-страницы,
6. кладёт нормализованный JSON в `src/generated/`.

Любая ошибка → сборка падает с подробным списком. Это и есть production-grade
подход PRD: ошибка в контенте всплывает в build-time, а не в рантайме.

Добавить задачу: положить YAML в `content/tasks/` — vite-плагин пересоберёт контент.

## Проверка решения

Чистое сопоставление (без реальной эмуляции git):

1. Слоты → массив строк (нормализованных).
2. Сравнение по очереди с каждым `validSolutions[].sequence`, с учётом
   `acceptableVariants` на шаге (алиасы `switch -` ↔ `checkout -` и пр.).
3. Любое совпадение по любому `kind` (ideal/standard/long) — задача засчитана.
4. Если использована хотя бы одна команда из `forbiddenCommands` — провал.
5. Очки = `points` ± бонусы/штрафы из `pointsModifiers`.

## Прогресс

Хранится в `localStorage` под ключом `crs.v1.state`. Кнопка «Заново» на экране
выбора чистит сессию (с подтверждением); кнопка «Заново» на экране задачи —
только текущую попытку.

## Документация

`/docs` — индекс задач + база знаний. Каждая задача доступна по
`/docs/tasks/{id}`. Кнопка «Не знаю» в игре открывает разбор задачи в
новой вкладке и помечает её как `solvedWithHint` (0 очков).
