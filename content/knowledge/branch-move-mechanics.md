# `git branch -m` — переименование ветки

`git branch -m` переименовывает локальную ветку. Но remote-ветку одной командой не переименовать — нужна последовательность из трёх шагов: переименовать локально, запушить новое имя, удалить старое.

## Переименование локальной ветки

```bash
# Переименовать текущую ветку:
git branch -m new-name

# Переименовать другую ветку:
git branch -m old-name new-name
```

## Полный цикл переименования с remote

```bash
# 1. Переименовать локально:
git branch -m fix-stuff fix/header-z-index

# 2. Запушить новое имя и настроить upstream:
git push origin -u fix/header-z-index

# 3. Удалить старое имя на remote:
git push origin --delete fix-stuff
```

После этого у тебя: локальная ветка `fix/header-z-index`, remote-ветка `origin/fix/header-z-index`, upstream настроен.

## Если у коллег была старая ветка

После удаления `fix-stuff` на remote у коллег останется "висячая" remote-tracking ветка. Им нужно:

```bash
git fetch origin --prune         # убрать устаревшие remote-tracking ветки
git fetch origin                 # получить новую ветку
```

## Подвохи

- **PR/MR на GitHub/GitLab** привязан к имени ветки. После удаления старой ветки на remote PR может закрыться или потерять связь. Перед переименованием уточни политику хостинга.
- **`-m` vs `-M`**: `-m` откажет если ветка с новым именем уже существует. `-M` перезапишет принудительно.
- **Upstream не обновляется автоматически.** После `git branch -m` upstream ветки может указывать на старое имя. Флаг `-u` при push или `git branch --set-upstream-to` исправляет это.
- **`git remote rename`** — другая команда, переименовывает *remote* (например, `origin`), а не ветку.

## Связанное

- [`push-autosetup`](./push-autosetup.md) — `push.autoSetupRemote` для автоматического upstream
- [`push-refspec`](./push-refspec.md) — синтаксис `local:remote` при push

## Официальная документация

- [git-branch(1)](https://git-scm.com/docs/git-branch) — флаги -m и -M
- [git-push(1)](https://git-scm.com/docs/git-push) — --delete, -u
