# Cherry-pick диапазона — краткая справка

Этот slug используется в контексте задачи H8 (`rebase --onto`). Подробная статья о диапазонах cherry-pick находится в [`cherry-pick-ranges`](./cherry-pick-ranges.md).

Для переноса серии коммитов у тебя два основных инструмента:

## `git cherry-pick` диапазоном

```bash
git cherry-pick A^..B    # перенести коммиты от A до B включительно
```

Подходит для точечного переноса нескольких коммитов. При конфликте останавливается на каждом коммите.

## `git rebase --onto` (часто лучше для серий)

```bash
git rebase --onto main feature/buttons feature/forms
```

Переносит всю "шапку" ветки `feature/forms` (коммиты после `feature/buttons`) на `main`. Одна команда вместо нескольких cherry-pick с разрешением конфликтов.

Когда `--onto` лучше:
- Нужно перенести много связанных коммитов.
- Ветка ответвилась не от той базы и нужно "пересадить" её целиком.
- Хочешь сохранить структуру истории (не плоский список cherry-pick).

## Связанное

- [`cherry-pick-ranges`](./cherry-pick-ranges.md) — полная статья про диапазоны cherry-pick
- [`rebase-onto-deep`](./rebase-onto-deep.md) — `--onto` для пересадки веток

## Официальная документация

- [git-cherry-pick(1)](https://git-scm.com/docs/git-cherry-pick) — синтаксис диапазонов
- [git-rebase(1)](https://git-scm.com/docs/git-rebase) — флаг --onto
