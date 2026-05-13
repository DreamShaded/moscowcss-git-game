# `git rebase --onto` — точная пересадка ветки

`git rebase --onto` — это хирургический инструмент: он берёт серию коммитов и пересаживает её на новую базу, при этом отсекая часть старой истории. Обычный `git rebase main` перемещает всю ветку; `--onto` даёт точный контроль над тем, что именно переносится.

## Синтаксис

```
git rebase --onto <newbase> <upstream> [<branch>]
```

- **`newbase`** — куда пересаживаем (новый родитель)
- **`upstream`** — откуда начинаем отсчёт (коммиты *после* этого попадут в результат)
- **`branch`** — что пересаживаем (по умолчанию — текущая ветка)

Проще запомнить так: берём коммиты из диапазона `(upstream, branch]` и кладём их поверх `newbase`.

## Типичные кейсы

### Ветка ответвилась не от той базы

```
main: A - B - C - D
                   \
feature/buttons:    E - F
                         \
feature/forms:            G - H - I
```

`feature/forms` по ошибке ответвилась от `feature/buttons` вместо `main`. Нужно перенести только G-H-I на main:

```bash
git rebase --onto main feature/buttons feature/forms
```

Результат: G'-H'-I' поверх main, без E и F.

### Вырезать средние коммиты

```bash
# Убрать коммиты B и C из истории:
# A - B - C - D - E  →  A - D' - E'
git rebase --onto A C main
# Берём коммиты после C (то есть D и E) и кладём на A
```

### Перенести ветку с одной feature на другую

```bash
git rebase --onto feature/new-base feature/old-base feature/my-work
```

## Диагностика перед выполнением

```bash
# Какие коммиты попадут в rebase:
git log --oneline feature/buttons..feature/forms

# Проверить базу:
git merge-base feature/buttons feature/forms
```

## Подвохи

- **Порядок аргументов критичен.** `--onto A B C` и `--onto B A C` дают разные результаты. Запоминай: "кладу поверх A, беру коммиты после B, из C".
- **После `--onto` нужен force push** если ветка уже запушена — хеши всех перенесённых коммитов меняются.
- **При конфликтах** — стандартный процесс: разрешить, `git add`, `git rebase --continue`. Или `git rebase --abort` для полного отката.
- **`--onto` не обновляет remote-tracking.** После успешного rebase не забудь `git push --force-with-lease`.

## Связанное

- [`rebase-recovery`](./rebase-recovery.md) — как откатить неудачный rebase
- [`cherry-pick-ranges`](./cherry-pick-ranges.md) — альтернатива для переноса коммитов без изменения базы
- [`force-with-lease-vs-force`](./force-with-lease-vs-force.md) — безопасный force push после rebase

## Официальная документация

- [git-rebase(1)](https://git-scm.com/docs/git-rebase) — секция --onto с примерами
