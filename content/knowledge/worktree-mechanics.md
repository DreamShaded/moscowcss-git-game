# `git worktree` — параллельная работа без clone и stash

`git worktree` позволяет создать дополнительную рабочую директорию, связанную с тем же репозиторием. В каждой директории — своя ветка, свой worktree, но общая объектная база. Это быстрее clone и безопаснее stash когда нужно срочно переключиться на другую задачу.

## Чем worktree отличается от clone

В случае clone — полная копия объектной базы, отдельный `.git/`. В случае worktree — один `.git/`, несколько рабочих директорий. Коммит в одном worktree сразу виден в другом. Никакого дублирования данных.

## Как использовать

```bash
# Создать новый worktree на основе существующей ветки
git worktree add ../cascadia-hotfix hotfix/safari-flex

# Создать новый worktree с новой веткой от main
git worktree add -b hotfix/safari-flex ../cascadia-hotfix main

# Список активных worktree
git worktree list

# Убрать worktree после завершения работы
git worktree remove ../cascadia-hotfix

# Убрать "мёртвые" ссылки на удалённые директории
git worktree prune
```

Типичный сценарий: ты на `feature/grid` с незакоммиченной работой, прилетает хотфикс.

```bash
git worktree add -b hotfix/nav-z-index ../cascadia-hotfix main
cd ../cascadia-hotfix
# работаешь, коммитишь, пушишь хотфикс
cd ../cascadia
git worktree remove ../cascadia-hotfix
```

## Ограничения

- **Одна ветка — один worktree.** Нельзя переключиться на ветку, которая уже открыта в другом worktree.
- **Sparse checkout** и некоторые хуки могут вести себя неожиданно в дополнительных worktree.
- **Путь** к worktree лучше держать рядом с основной директорией (или в `/tmp/`), не внутри неё.

## Подвохи

- **После удаления директории** без `git worktree remove` остаётся "мёртвая" запись. `git worktree prune` её почистит.
- **`.git` в дополнительном worktree** — это файл (не директория) с путём к основному `.git/`. Не удаляй его вручную.
- **Stash не расшарен** между worktree — stash, сделанный в основном worktree, доступен только там.

## Связанное

- [`worktree-vs-clone`](./worktree-vs-clone.md) — когда worktree, когда clone
- [`stash-advanced`](./stash-advanced.md) — альтернатива для более простых ситуаций

## Официальная документация

- [git-worktree(1)](https://git-scm.com/docs/git-worktree) — полный референс
