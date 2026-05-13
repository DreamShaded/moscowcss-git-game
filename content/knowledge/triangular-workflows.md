# Triangular workflows — `@{push}` vs `@{upstream}`

В стандартном workflow push и pull идут в одно место: `origin`. В triangular workflow они разные: тянешь из `upstream` (официальный репо), пушишь в `origin` (свой fork). Это типично для open source и больших организаций.

## Схема

```
upstream/main  ←──fetch──  origin/main  ←──push──  local/main
(официальный)              (твой fork)
```

## `@{upstream}` vs `@{push}`

**`@{upstream}` / `@{u}`** — ветка, откуда тянешь (`pull`/`fetch`). В triangular workflow — `upstream/main`.

**`@{push}`** — ветка, куда пушишь. В triangular workflow — `origin/main`.

```bash
git log @{u}..HEAD           # мои коммиты относительно upstream
git log @{push}..HEAD        # что ещё не запушено в мой fork

git diff @{u}                # разница с официальным репо
git diff @{push}             # разница с моим fork
```

## Настройка triangular workflow

```bash
# Добавить upstream как remote:
git remote add upstream https://github.com/original/repo.git

# Настроить ветку: тянуть из upstream, пушить в origin:
git branch --set-upstream-to=upstream/main main
git config branch.main.pushRemote origin
# или глобально:
git config --global remote.pushDefault origin
```

## Когда `@{push}` и `@{u}` совпадают

В обычном (нетреугольном) workflow оба указывают на `origin/<branch>`. Разница между ними — только в triangular workflow.

## Подвохи

- **`push.autoSetupRemote=true`** в triangular workflow может запушить в `upstream` вместо `origin`, если `pushRemote` не настроен явно.
- **`git pull`** без аргументов тянет из `@{u}`. **`git push`** без аргументов пушит в `@{push}`. Если они разные — поведение именно такое.
- **GitHub fork** по умолчанию настраивает `origin` на твой fork. Upstream нужно добавлять вручную.

## Связанное

- [`push-refspec`](./push-refspec.md) — синтаксис `local:remote` для явного указания куда пушить
- [`push-autosetup`](./push-autosetup.md) — автоматический upstream, нюансы с triangular
- [`revision-syntax-deep`](./revision-syntax-deep.md) — полный синтаксис `@{u}` и `@{push}`

## Официальная документация

- [git-config(1)](https://git-scm.com/docs/git-config) — remote.pushDefault, branch.*.pushRemote
- [gitrevisions(7)](https://git-scm.com/docs/gitrevisions) — синтаксис @{push} и @{upstream}
