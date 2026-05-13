# Push refspec — синтаксис `local:remote`

Refspec в `git push` позволяет явно указать, какую локальную ветку пушить и под каким именем на remote. По умолчанию git пушит текущую ветку под тем же именем — refspec нужен когда имена должны отличаться.

## Синтаксис

```bash
git push <remote> <local-branch>:<remote-branch>
```

## Примеры

```bash
# Запушить локальную wip-experiment как feature/experiment-x на remote:
git push origin wip-experiment:feature/experiment-x

# Запушить текущую ветку под другим именем:
git push origin HEAD:feature/experiment-x

# Удалить ветку на remote (пустой local):
git push origin :old-branch-name
# или явно:
git push origin --delete old-branch-name

# Запушить тег:
git push origin v1.2.3:refs/tags/v1.2.3
```

## Когда нужен refspec

- Локальное имя ветки не соответствует конвенции remote (например, `wip-X` → `feature/X`).
- Triangular workflow: разные имена в upstream и fork.
- Деплой: `git push production main:refs/heads/deploy`.

## Подвохи

- **Без `-u`** push с refspec не настраивает upstream. Последующий `git push` снова потребует явного refspec. Добавь `-u` если хочешь настроить отслеживание: `git push -u origin wip:feature/x`.
- **Пустой local** (`git push origin :branch`) удаляет remote-ветку. Это деструктивная операция без подтверждения.
- **`HEAD:refs/heads/branch`** — явный способ указать ветку через refs-путь. Нужен в некоторых Git-хостингах и кастомных remote.

## Связанное

- [`push-autosetup`](./push-autosetup.md) — автоматический upstream для стандартных случаев
- [`triangular-workflows`](./triangular-workflows.md) — `@{push}` vs `@{upstream}` в fork-workflow
- [`branch-move-mechanics`](./branch-move-mechanics.md) — переименование ветки на remote

## Официальная документация

- [git-push(1)](https://git-scm.com/docs/git-push) — секция "refspec"
