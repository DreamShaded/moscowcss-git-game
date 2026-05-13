# Что git хранит в `.git/` во время merge

Когда запущен `git merge` и есть конфликты — git создаёт несколько файлов в `.git/`, которые описывают текущее состояние слияния. Они используются командами `merge --abort`, `merge --continue` и помогают при ручном разрешении конфликтов.

## Файлы состояния merge

**`.git/MERGE_HEAD`** — хеш коммита, который вливается. Существует только во время активного merge. Пропадает после `git commit` или `git merge --abort`.

**`.git/MERGE_MSG`** — сообщение коммита по умолчанию для merge-коммита. Git генерирует его автоматически: "Merge branch 'feature/x' into main". Можно отредактировать перед `git commit`.

**`.git/MERGE_MODE`** — флаг, что merge в процессе (не всегда создаётся).

```bash
# Проверить, идёт ли сейчас merge:
cat .git/MERGE_HEAD         # если файл есть — merge активен

# Посмотреть коммит, который вливаем:
git show MERGE_HEAD

# Diff: что мы + что они:
git diff HEAD MERGE_HEAD

# Какие файлы в конфликте:
git status
```

## Как команды используют эти файлы

**`git merge --abort`** — читает `MERGE_HEAD`, восстанавливает состояние до merge, удаляет все merge-файлы.

**`git commit`** после разрешения конфликтов — создаёт merge-коммит с двумя родителями: HEAD и MERGE_HEAD. Использует `MERGE_MSG` как сообщение по умолчанию.

**`git merge --continue`** — то же что `git commit`, но с дополнительной проверкой что нет неразрешённых конфликтов.

## Подвохи

- **`git reset --hard HEAD`** во время merge удаляет изменения из worktree и index, но `MERGE_HEAD` и `MERGE_MSG` могут остаться. Это один из поводов использовать `merge --abort` вместо reset.
- **Если удалил `.git/MERGE_HEAD` вручную** — git перестанет считать merge активным, но рабочая директория останется с конфликтными маркерами. Чистить придётся вручную.
- **При cherry-pick** тоже создаются аналогичные файлы: `.git/CHERRY_PICK_HEAD`.

## Связанное

- [`abort-vs-reset`](./abort-vs-reset.md) — почему `merge --abort` правильнее чем `reset --hard HEAD`
- [`automatic-refs`](./automatic-refs.md) — MERGE_HEAD как автоматический ref
- [`rerere-internals`](./rerere-internals.md) — как rerere использует информацию о конфликте

## Официальная документация

- [git-merge(1)](https://git-scm.com/docs/git-merge) — секции --abort и --continue
