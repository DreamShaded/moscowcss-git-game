# `git revert` merge-коммита — флаг `-m`

Откатить обычный коммит через `git revert` просто. С merge-коммитом сложнее: у него два родителя, и git не знает, какую "сторону" считать основной. Нужен флаг `-m N` (mainline).

## Синтаксис

```bash
git revert -m 1 <merge-hash>
```

`-m 1` — первый родитель является основной линией (mainline). Revert отменит всё, что влитая ветка добавила.

`-m 2` — второй родитель является основной. Используется редко.

## Как определить, кто первый родитель

```bash
git show <merge-hash>
# Строка: Merge: abc123 def456
# abc123 — первый родитель (ветка, В которую мержили)
# def456 — второй родитель (ветка, КОТОРУЮ мержили)
```

Обычно первый родитель — это `main` или `develop`, второй — feature-ветка. Для отмены feature — `git revert -m 1`.

## Пример

```bash
# В main случайно смержили feature с багом:
git log --oneline --merges -1   # найти хеш merge-коммита
git revert -m 1 <merge-hash>    # создать revert-коммит
git push                         # безопасно, история не переписана
```

## Подвохи

- **После revert merge-коммита** feature-ветка "мертва" для этого репо. Если попробуешь смержить ту же feature снова — git скажет "Already up to date" или смержит только коммиты, которые добавились после oригинального merge. Чтобы повторно влить исправленную feature — нужно сначала revert самого revert'а: `git revert <revert-hash>`.
- **`git revert -m 1`** создаёт коммит, который отменяет *diff* между первым родителем и merge-коммитом — то есть все изменения из feature-ветки.
- **Конфликты возможны** если после merge были коммиты, которые зависят от изменений из отменяемой feature.

## Связанное

- [`revert-vs-reset`](./revert-vs-reset.md) — когда revert, когда reset
- [`cherry-pick-merge-commits`](./cherry-pick-merge-commits.md) — аналогичный флаг `-m` для cherry-pick

## Официальная документация

- [git-revert(1)](https://git-scm.com/docs/git-revert) — флаг -m / --mainline
