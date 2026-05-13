# Workflow `--fixup` + `rebase --autosquash`

Вместо wip-коммитов типа "fix typo", "oops", "actually fix" — можно использовать `git commit --fixup`, который явно привязывает правку к целевому коммиту. При последующем `git rebase -i --autosquash` git автоматически расставит fixup-коммиты перед нужными коммитами и пометит их `fixup`.

## Workflow

```bash
# 1. Сделали коммит:
git commit -m "feat: add modal component"
# Хеш: abc123

# 2. Нашли ошибку в том же коммите, исправили:
git add src/modal.css
git commit --fixup=abc123
# Создаст коммит: "fixup! feat: add modal component"

# 3. Когда готов к cleanup:
git rebase -i --autosquash HEAD~5
# Git сам расставит fixup-коммит сразу после abc123 и пометит его fixup
```

## Варианты `--fixup`

```bash
git commit --fixup=<hash>        # fixup: слить, выбросить сообщение
git commit --squash=<hash>       # squash: слить, предложить объединить сообщения
git commit --fixup=amend:<hash>  # amend: изменить сообщение коммита + слить изменения
```

## Настройка autosquash глобально

```bash
git config --global rebase.autoSquash true
# Теперь git rebase -i автоматически включает autosquash
```

## Когда это полезно

- Долгая feature-ветка: делаешь правки по review, привязываешь к конкретным коммитам.
- Пишешь "как получается", потом перед PR одним `rebase -i --autosquash` приводишь историю в порядок.
- Работа в паре: явная привязка "это правка к тому коммиту" помогает ревьюеру понять контекст.

## Подвохи

- **`--fixup` использует сообщение коммита**, не хеш, для автопоиска. Если два коммита с одинаковым началом сообщения — autosquash может перепутать. Используй хеш, а не `-C HEAD~2`.
- **`--autosquash` только расставляет**, не применяет автоматически. Ты всё равно увидишь редактор с уже расставленными командами — можешь скорректировать.
- **После `rebase -i --autosquash`** все хеши меняются. Force push если ветка уже запушена.

## Связанное

- [`rebase-interactive-actions`](./rebase-interactive-actions.md) — все действия в интерактивном rebase
- [`commit-fixup-autosquash`](./commit-fixup-autosquash.md) — дополнительные детали workflow

## Официальная документация

- [git-commit(1)](https://git-scm.com/docs/git-commit) — флаги --fixup и --squash
- [git-rebase(1)](https://git-scm.com/docs/git-rebase) — флаг --autosquash
