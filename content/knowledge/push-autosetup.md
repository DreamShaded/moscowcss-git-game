# `push.autoSetupRemote` — автоматический upstream при первом push

По умолчанию при первом `git push` новой ветки git выдаёт ошибку: "The current branch has no upstream branch". Нужно явно писать `git push -u origin <branch>`. Настройка `push.autoSetupRemote=true` убирает этот шаг — git делает это автоматически.

## Настройка

```bash
git config --global push.autoSetupRemote true
```

После этого `git push` на новой ветке автоматически:
1. Пушит ветку в `origin` под тем же именем.
2. Настраивает upstream (`-u`), чтобы последующие `git push` и `git pull` работали без аргументов.

## До и после

```bash
# До настройки — ошибка при первом push:
git push
# fatal: The current branch feature/grid has no upstream branch.
# To push the current branch and set the remote as upstream, use:
#     git push --set-upstream origin feature/grid

# После git config --global push.autoSetupRemote true:
git push   # работает сразу
```

## Когда это не подходит

- **Triangular workflow** (fork + upstream): push должен идти в fork, а не в upstream. `autoSetupRemote` может запушить не туда. Используй явные remote в этом случае.
- **Разные имена** локальной и remote-ветки: `autoSetupRemote` всегда использует то же имя. Для `local:remote` нужен явный push-refspec.

## Связанное

- [`push-refspec`](./push-refspec.md) — синтаксис `local:remote` для нестандартных случаев
- [`triangular-workflows`](./triangular-workflows.md) — когда push-remote и upstream разные
- [`branch-move-mechanics`](./branch-move-mechanics.md) — переименование ветки и обновление upstream

## Официальная документация

- [git-config(1)](https://git-scm.com/docs/git-config) — параметр push.autoSetupRemote
- [git-push(1)](https://git-scm.com/docs/git-push) — флаг -u / --set-upstream
