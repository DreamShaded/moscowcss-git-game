# `pull.rebase` — rebase вместо merge при git pull

По умолчанию `git pull` делает fetch + merge. Если в upstream появились новые коммиты — создаётся merge-коммит, даже если ты просто "подтягиваешь" изменения. Настройка `pull.rebase=true` меняет поведение: вместо merge делается rebase твоих локальных коммитов поверх того, что пришло.

## Настройка

```bash
# Глобально (рекомендуется):
git config --global pull.rebase true

# Только для текущего репо:
git config pull.rebase true

# Разовый pull с rebase без изменения конфига:
git pull --rebase origin main
```

## Что меняется

```bash
# До: git pull = fetch + merge
# История: A - B - C - M (merge-коммит)
#                   \- D (твой коммит)

# После pull.rebase=true: git pull = fetch + rebase
# История: A - B - C - D' (твой коммит пересажен)
```

Результат — линейная история без лишних merge-коммитов.

## Дополнительная настройка

```bash
# Автоматический stash перед rebase и pop после:
git config --global rebase.autoStash true
```

С `rebase.autoStash=true` не нужно вручную делать stash перед `git pull --rebase` при dirty worktree.

## Три значения pull.rebase

- `false` — merge (дефолт)
- `true` — rebase
- `merges` — rebase с сохранением merge-коммитов (для веток с merge внутри)

## Подвохи

- **При конфликте во время pull --rebase** процесс останавливается как при обычном rebase: разрешить конфликт, `git add`, `git rebase --continue`. Или `git rebase --abort` для отмены.
- **Если у тебя есть локальные коммиты** — pull.rebase их пересаживает. Хеши меняются. Если эти коммиты уже запушены — нужен force push (что не всегда уместно).
- **На чистом (без локальных коммитов) worktree** разницы между merge и rebase нет — в обоих случаях будет fast-forward.
- **В командах с нелинейной историей** pull.rebase может быть нежелательным — уточни конвенцию команды.

## Связанное

- [`linear-history-philosophy`](./linear-history-philosophy.md) — зачем нужна линейная история
- [`rebase-recovery`](./rebase-recovery.md) — что делать если pull --rebase пошёл не так

## Официальная документация

- [git-config(1)](https://git-scm.com/docs/git-config) — параметры pull.rebase и rebase.autoStash
- [git-pull(1)](https://git-scm.com/docs/git-pull) — флаг --rebase
