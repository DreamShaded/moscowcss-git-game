# `merge --abort` vs `reset --hard HEAD` — в чём разница

Оба варианта прерывают незавершённый merge и возвращают репо в состояние до него. Но делают это по-разному, и в edge-кейсах разница критична.

## Что делает каждый

**`git merge --abort`**:
- Читает `.git/MERGE_HEAD` и `.git/ORIG_HEAD`
- Восстанавливает worktree и index в состояние до старта merge
- Удаляет все merge-state файлы (`.git/MERGE_HEAD`, `.git/MERGE_MSG`)
- Корректно обрабатывает случай, когда до merge был dirty worktree

**`git reset --hard HEAD`**:
- Перемещает HEAD и index на текущий коммит
- Сбрасывает worktree до HEAD
- **Не удаляет** `.git/MERGE_HEAD` и `.git/MERGE_MSG` (в некоторых версиях git)
- Теряет незакоммиченные изменения, которые были до merge

## Когда какой использовать

```bash
# Стандартная ситуация: прервать merge, всё вернуть:
git merge --abort

# Если merge --abort недоступен (редкий случай — файлы состояния потеряны):
git reset --hard ORIG_HEAD    # ORIG_HEAD установлен перед merge
```

## Почему `merge --abort` лучше

1. **Семантически точнее**: команда явно говорит "отменить merge", а не "сбросить всё".
2. **Чище убирает состояние**: гарантированно удаляет merge-файлы.
3. **Безопаснее при dirty worktree**: если до merge у тебя были незакоммиченные изменения (и merge их не затронул), `--abort` их сохранит. `reset --hard` уничтожит.

## Подвохи

- **`merge --abort` не работает** если merge уже завершён (коммит создан). Тогда нужен `git revert` или `git reset --hard ORIG_HEAD`.
- **`merge --abort` не работает** если `.git/MERGE_HEAD` уже нет (например, ты вручную почистил). В этом случае — `reset --hard ORIG_HEAD`.
- **`reset --hard HEAD`** во время merge не восстанавливает состояние *до* merge — HEAD уже на том же месте, что был до merge (merge не создал коммит). Это может запутать.

## Связанное

- [`merge-state-files`](./merge-state-files.md) — что git хранит в `.git/` во время merge
- [`revert-vs-reset`](./revert-vs-reset.md) — как отменить уже завершённый merge

## Официальная документация

- [git-merge(1)](https://git-scm.com/docs/git-merge) — флаг --abort
