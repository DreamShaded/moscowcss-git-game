# Протокол команды после force push в shared ветку

Когда переписывается история shared ветки (develop, release, или долгоживущая feature на несколько человек) — нужна явная координация. Без неё часть команды будет работать со старой историей и создаст конфликты при следующем push.

## Протокол для того, кто делает force push

1. **Предупреди команду** до push: "Сейчас буду force-push в develop, подождите 5 минут".
2. **Дождись подтверждения** или дай время завершить текущие push.
3. **Сделай force push с lease**: `git push --force-with-lease origin develop`.
4. **Сообщи после**: "Force push сделан, обновляйтесь через `git fetch` + `git reset --hard origin/develop`".

## Протокол для тех, кто получил сообщение

```bash
# Сохранить незакоммиченное (если есть)
git stash

# Скачать новую историю
git fetch origin

# Если нет своих коммитов поверх develop:
git reset --hard origin/develop

# Если есть свои коммиты (работал от develop):
git rebase origin/develop
# при конфликтах — разрешить, git rebase --continue

# Вернуть незакоммиченное
git stash pop
```

## Если узнал о force push постфактум

```bash
git fetch origin

# Посмотреть расхождение
git log --oneline HEAD...origin/develop

# Если нет своих коммитов — просто reset
git reset --hard origin/develop

# Если есть свои коммиты — rebase
git rebase origin/develop
```

## Подвохи

- **`git pull` после force push** — ловушка. Pull попытается смержить старую и новую историю, создав merge-коммит с дублями всех ребейзнутых коммитов. Всегда `fetch` + `reset/rebase`.
- **Не делай force push в main без явного согласования** всей команды и желательно вне рабочих часов.
- **После filter-repo** (полная перезапись истории) протокол жёстче: все должны сделать свежий clone, а не пытаться обновить существующие локальные копии.

## Связанное

- [`force-with-lease-vs-force`](./force-with-lease-vs-force.md) — как безопасно делать force push
- [`post-rewrite-protocol`](./post-rewrite-protocol.md) — базовый протокол для одного участника
- [`filter-repo-vs-branch`](./filter-repo-vs-branch.md) — полная перезапись истории, самый тяжёлый случай

## Официальная документация

- [git-push(1)](https://git-scm.com/docs/git-push) — --force-with-lease, --force-if-includes
