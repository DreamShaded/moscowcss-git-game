# Что делать команде после force push

После того как кто-то переписал историю ветки и сделал force push — у остальных участников локальные копии этой ветки расходятся с remote. Если просто сделать `git pull` — git попытается смержить две разошедшиеся истории, что создаст запутанный merge-коммит с дублями.

Правильный protocol: **fetch + reset**, а не pull.

## Стандартный порядок действий

После того как тебе сообщили о force push в ветку:

```bash
git fetch origin                          # скачать новую историю

# Если ты на этой ветке:
git reset --hard origin/feature/grid      # привести локальную ветку к remote

# Если у тебя есть локальные коммиты поверх старой истории ветки:
git rebase origin/feature/grid            # пересадить свои коммиты на новую базу
```

## Если у тебя есть локальная работа поверх старой истории

```bash
git fetch origin
# Найти, где твои коммиты расходятся с новой историей:
git log --oneline HEAD...origin/feature/grid

# Вариант 1: rebase своих коммитов на новую историю
git rebase origin/feature/grid

# Вариант 2: если своих коммитов нет — просто сброс
git reset --hard origin/feature/grid
```

## Подвохи

- **`git pull` после force push** создаёт merge-коммит, соединяющий старую и новую историю. Это почти всегда не то, что нужно — получаются дубли коммитов.
- **Сообщай команде** до force push, а не после. Хорошая практика: предупредить в чате, дать время завершить текущую работу, потом пушить.
- **В shared-ветках** (`main`, `develop`) force push в большинстве команд запрещён или требует явного согласования. Feature-ветки — другое дело.
- **Stash незакоммиченного** перед reset: `git stash` → `git reset --hard origin/...` → `git stash pop`.

## Связанное

- [`force-with-lease-vs-force`](./force-with-lease-vs-force.md) — как безопасно делать force push
- [`post-rewrite-team-protocol`](./post-rewrite-team-protocol.md) — расширенный протокол для shared веток
- [`rebase-recovery`](./rebase-recovery.md) — если твой rebase пошёл не так

## Официальная документация

- [git-fetch(1)](https://git-scm.com/docs/git-fetch) — скачивание без слияния
- [git-reset(1)](https://git-scm.com/docs/git-reset) — режимы reset
