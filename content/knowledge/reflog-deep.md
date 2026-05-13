# Reflog веток: `git reflog show <branch>`

`git reflog` без аргументов показывает историю HEAD — то есть всё, что ты делал вообще. Но если тебя интересует история конкретной ветки, а не всего HEAD, нужен `git reflog show <branch>`.

Разница существенная: если ты переключаешься между ветками, `HEAD reflog` фиксирует каждое переключение, а `branch reflog` фиксирует только то, что двигало саму ветку (коммиты, reset, merge в неё).

## Когда это нужно

- Найти, на каком коммите `feature/grid` была вчера, до ребейза.
- Восстановить удалённую ветку — reflog ветки хранится даже после `git branch -D`, пока не сделан gc.
- Понять, что вообще происходило с конкретной веткой: кто и когда её двигал.

## Как использовать

```bash
git reflog show main              # история ветки main
git reflog show feature/grid      # история feature-ветки
git reflog show HEAD              # то же, что git reflog (история HEAD)

# Восстановление удалённой ветки через её reflog:
git reflog show feature/animations   # найти последний хеш
git branch feature/animations <hash> # воссоздать ветку
```

Записи в `git reflog show <branch>` выглядят как:
```
abc1234 feature/grid@{0}: commit: fix grid gap
def5678 feature/grid@{1}: rebase finished: refs/heads/feature/grid onto ...
```

## Подвохи

- **После `git branch -D`** reflog ветки ещё существует в `.git/logs/refs/heads/<branch>` — до следующего gc. Это окно для восстановления.
- **`branch@{n}` — индекс в reflog ветки**, не HEAD. `feature/grid@{1}` — предыдущая позиция именно этой ветки, а не HEAD.
- **Remote-ветки** тоже имеют reflog: `git reflog show origin/main` — история того, как обновлялась remote-tracking ветка при fetch.
- **Срок хранения** — 90 дней для достижимых записей, 30 дней для недостижимых. После gc восстановление только через `fsck`.

## Связанное

- [`reflog-mechanics`](./reflog-mechanics.md) — основы reflog, HEAD reflog, время жизни записей
- [`fsck-dangling`](./fsck-dangling.md) — восстановление когда reflog уже почищен
- [`gc-timing`](./gc-timing.md) — когда git запускает gc и что при этом теряется

## Официальная документация

- [git-reflog(1)](https://git-scm.com/docs/git-reflog) — полный референс
