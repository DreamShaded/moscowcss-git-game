# `git show branch:path` — прочитать файл из другой ветки или коммита

`git show` умеет показывать не только коммиты, но и конкретные файлы из любой точки истории — без переключения ветки и без изменения рабочей директории.

## Синтаксис

```bash
git show <ref>:<path>
```

Где `<ref>` — любая ревизия: ветка, тег, хеш коммита, `HEAD`, `stash@{0}` и т.д.

## Примеры

```bash
# Прочитать файл из другой ветки:
git show main:src/styles/variables.css

# Прочитать файл из конкретного коммита:
git show abc123:src/styles/variables.css

# Прочитать версию из HEAD (то же что и HEAD):
git show HEAD:src/styles/variables.css

# Прочитать staged версию (из индекса):
git show :src/styles/variables.css   # : без ref = индекс

# Сохранить версию из другой ветки в файл:
git show main:src/styles/variables.css > /tmp/variables-main.css

# Восстановить файл из другой ветки (аналог restore --source):
git show main:src/styles/variables.css > src/styles/variables.css
```

## Подвохи

- **`:path` (без ref)** — это staged версия файла из индекса. Полезно посмотреть что именно проиндексировано при конфликте.
- **При конфликте merge** в индексе три версии файла: `:1:path` (общий предок), `:2:path` (наша версия), `:3:path` (их версия). Это мощный инструмент при ручном разрешении.
- **Путь чувствителен к регистру** и должен быть относительным от корня репо, не от текущей директории.
- **`git show` vs `git cat-file`**: для просмотра файлов `git show` удобнее; `git cat-file -p <ref>:<path>` — более низкоуровневый аналог.

## Связанное

- [`restore-vs-checkout`](./restore-vs-checkout.md) — `git restore --source` для восстановления файла в worktree
- [`pickaxe-vs-grep`](./pickaxe-vs-grep.md) — поиск коммитов, трогавших конкретный контент

## Официальная документация

- [git-show(1)](https://git-scm.com/docs/git-show) — полный референс
