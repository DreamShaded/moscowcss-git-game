# `git restore` vs `git checkout` — современная триада

До git 2.23 `git checkout` делал всё: переключал ветки, восстанавливал файлы, создавал ветки. В 2.23 появились `git switch` и `git restore`, которые разделили эти обязанности. Старый `checkout` никуда не делся, но новые команды однозначнее по смыслу.

## Матрица замен

| Старый синтаксис | Новый синтаксис | Что делает |
|-----------------|----------------|-----------|
| `git checkout <branch>` | `git switch <branch>` | Переключить ветку |
| `git checkout -b <branch>` | `git switch -c <branch>` | Создать и переключить |
| `git checkout -` | `git switch -` | Переключить на предыдущую ветку |
| `git checkout -- <file>` | `git restore <file>` | Отменить изменения в файле (из индекса) |
| `git checkout HEAD -- <file>` | `git restore --source=HEAD <file>` | Восстановить файл из HEAD |
| `git checkout <branch> -- <file>` | `git restore --source=<branch> <file>` | Восстановить файл из другой ветки |
| `git reset HEAD <file>` | `git restore --staged <file>` | Убрать файл из индекса |

## Примеры

```bash
# Восстановить файл к версии из main:
git restore --source=main src/styles/variables.css

# Убрать файл из индекса (не трогая worktree):
git restore --staged src/styles/variables.css

# Убрать и из индекса, и из worktree:
git restore --staged --worktree src/styles/variables.css

# Старый способ (всё ещё работает):
git checkout main -- src/styles/variables.css
```

## Подвохи

- **`git restore <file>` без `--source`** восстанавливает из индекса, не из HEAD. Если файл есть в индексе — восстановится именно оттуда. Если нет — из HEAD.
- **`git restore` необратимо** для незакоммиченных изменений в worktree. Это не "soft" операция.
- **`git switch` отказывается** переключать ветку при dirty worktree (если изменения конфликтуют). `git checkout` в таких случаях иногда молча делал merge. `switch` явно сообщает об ошибке.
- **В скриптах** старый `checkout` более совместим — не все версии git имеют `switch`/`restore`. В интерактивной работе — предпочитай новые команды.

## Связанное

- [`git-show-paths`](./git-show-paths.md) — `git show branch:path` для просмотра файла без восстановления
- [`switch-dash-aliases`](./switch-dash-aliases.md) — `switch -` и другие shortcuts

## Официальная документация

- [git-restore(1)](https://git-scm.com/docs/git-restore) — полный референс
- [git-switch(1)](https://git-scm.com/docs/git-switch) — полный референс
