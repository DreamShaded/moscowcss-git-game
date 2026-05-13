# `switch -`, `checkout -`, `checkout @{-1}` — быстрое переключение веток

Дефис `-` как аргумент к `switch` и `checkout` означает "предыдущая ветка" — то же, что `cd -` в shell. Это быстрый способ переключаться между двумя ветками без запоминания имён.

## Три эквивалентных способа

```bash
git switch -           # переключиться на предыдущую ветку
git checkout -         # то же, старый синтаксис
git checkout @{-1}     # явный reflog-синтаксис, то же самое
```

Все три делают одно: переключают на ветку, на которой был HEAD до текущей.

## Как это работает

`-` — это alias для `@{-1}`, который в свою очередь означает "ветка, на которой был HEAD один переход назад". Git хранит эту информацию в reflog.

## Примеры использования

```bash
# Быстрое сравнение двух веток:
git switch review/feature-x
git switch -              # вернуться на свою ветку
git switch -              # снова на review/feature-x

# После hotfix вернуться к своей работе:
git switch main           # переключился для hotfix
# ... сделал hotfix ...
git switch -              # вернулся на feature/grid

# Цепочка переключений (задача M9):
git switch review/feature-x
git switch -
git switch -              # feature-x
git switch -              # своя
git switch -              # feature-x
```

## Подвохи

- **`-` переключает на ветку, а не на коммит.** Если предыдущая позиция HEAD была в detached state (например, после `git checkout <hash>`) — `switch -` туда не переключит. `git switch` требует имя ветки.
- **`@{-1}` работает и в других контекстах.** `git merge @{-1}` — смержить предыдущую ветку. `git log @{-1}` — история предыдущей ветки.
- **`@{-2}`, `@{-3}`** — ветки ещё дальше в истории переключений. Это уже только через явный reflog-синтаксис, `-` доступен только для одного шага назад.

## Связанное

- [`revision-syntax-deep`](./revision-syntax-deep.md) — `@{-1}`, `@{u}`, `@{push}` и другие специальные синтаксисы
- [`head-history-syntax`](./head-history-syntax.md) — `HEAD@{n}` vs `HEAD~n` vs `HEAD^n`

## Официальная документация

- [git-switch(1)](https://git-scm.com/docs/git-switch) — флаг `-` и поведение
- [gitrevisions(7)](https://git-scm.com/docs/gitrevisions) — синтаксис `@{-n}`
