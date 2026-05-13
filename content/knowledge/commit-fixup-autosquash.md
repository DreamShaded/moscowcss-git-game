# `git commit --fixup` и `rebase --autosquash` — детали

Эта статья — дополнение к [`commit-fixup-flow`](./commit-fixup-flow.md). Здесь подробнее про механику autosquash и нюансы применения.

## Как autosquash определяет, куда вставить fixup

Git ищет коммит, сообщение которого совпадает с частью после `fixup! `. То есть для коммита `fixup! feat: add modal component` git ищет коммит с сообщением, начинающимся с `feat: add modal component`.

```bash
# Можно указать хеш явно:
git commit --fixup=abc123

# Или через ссылку:
git commit --fixup=HEAD~3
```

## Три вида fixup-коммитов

```bash
git commit --fixup=<ref>         # "fixup! ..." — слить изменения, выбросить сообщение
git commit --squash=<ref>        # "squash! ..." — слить изменения, предложить новое сообщение
git commit --fixup=amend:<ref>   # "amend! ..." — исправить и сообщение, и изменения
```

`amend!` удобен когда нашёл опечатку в сообщении коммита: создаёт коммит, который при autosquash исправит и файлы, и сообщение.

## Глобальная настройка

```bash
git config --global rebase.autoSquash true   # autosquash всегда включён в rebase -i
git config --global rebase.autoStash true    # автоматически stash перед rebase
```

## Подвохи

- **Порядок в редакторе после autosquash**: fixup-коммиты вставляются сразу после целевого. Если у тебя `pick A`, `pick B`, `fixup! A` — результат будет `pick A`, `fixup (A)`, `pick B`. Проверь перед сохранением.
- **`--fixup` не работает с первым коммитом** в истории (нет предшествующего коммита для squash). Используй `git rebase -i --root` для работы с самым первым.
- **Конфликты при autosquash** разрешаются как обычно: `git add` → `git rebase --continue`.

## Связанное

- [`commit-fixup-flow`](./commit-fixup-flow.md) — основная статья с полным workflow
- [`rebase-interactive-actions`](./rebase-interactive-actions.md) — все команды интерактивного rebase

## Официальная документация

- [git-commit(1)](https://git-scm.com/docs/git-commit) — --fixup, --squash, --fixup=amend
- [git-rebase(1)](https://git-scm.com/docs/git-rebase) — --autosquash, rebase.autoSquash
