# Расширенный синтаксис ревизий: `@{u}`, `@{push}`, `^{tree}`, `:/regex`

Git поддерживает богатый синтаксис для указания коммитов и объектов — помимо очевидных хешей и имён веток. Эти формы редко нужны в повседневной работе, но в нужный момент сильно сокращают количество команд.

## `@{upstream}` / `@{u}` — upstream-ветка

```bash
git log @{u}..HEAD           # мои коммиты, которых нет в upstream
git diff @{u}                # что изменилось относительно upstream
git rebase @{u}              # ребейз на upstream без явного имени
```

`@{u}` — это то, откуда ты тянешь (`pull`). Обычно `origin/<branch>`.

## `@{push}` — push-remote-ветка

```bash
git log @{push}..HEAD        # что ещё не запушено
git diff @{push}             # разница с тем, что на remote
```

`@{push}` — ветка на remote, куда идёт `push`. В большинстве случаев совпадает с `@{u}`, но в triangular workflow (`fork → upstream`) они разные.

## `@{-n}` — предыдущие ветки

```bash
git switch @{-1}             # предыдущая ветка (то же что switch -)
git merge @{-1}              # смержить предыдущую ветку
```

## `^{tree}` — дерево коммита

```bash
git show HEAD^{tree}         # дерево файлов HEAD (без метаданных коммита)
git diff HEAD^{tree}         # diff против дерева
```

Полезно для скриптов, где нужен объект-дерево, а не объект-коммит.

## `:/regex` — поиск коммита по сообщению

```bash
git show :/hotfix            # последний коммит, в сообщении которого есть "hotfix"
git show ":/fix: button"     # точнее
git diff :/refactor..HEAD    # от коммита с "refactor" до HEAD
```

`:/regex` находит самый последний коммит, чьё сообщение содержит совпадение.

## `branch@{n}` — история конкретной ветки

```bash
git show main@{yesterday}    # где main была вчера
git show main@{2.days.ago}   # 2 дня назад
git show feature@{3}         # 3 позиции назад в reflog ветки
```

## Комбинирование

```bash
git log @{u}..@{push}        # коммиты между upstream и push-remote
git diff HEAD^{tree} @{u}^{tree}   # только файловые различия без метаданных
```

## Подвохи

- **`@{u}` требует настроенного upstream.** Если ветка не отслеживает remote-ветку — `@{u}` выдаст ошибку. Настройка: `git branch --set-upstream-to=origin/<branch>`.
- **`:/regex` ищет снизу вверх** по истории — то есть находит самый *свежий* подходящий коммит.
- **`^{tree}` и `^{commit}`** — суффиксы разрешения типа объекта. `^{}` разыменовывает tag до коммита.
- **В Windows PowerShell** `{}` и `^` требуют экранирования или кавычек.

## Связанное

- [`head-history-syntax`](./head-history-syntax.md) — `HEAD~n`, `HEAD^n`, `HEAD@{n}`
- [`switch-dash-aliases`](./switch-dash-aliases.md) — `@{-1}` в контексте переключения веток
- [`triangular-workflows`](./triangular-workflows.md) — когда `@{u}` и `@{push}` разные

## Официальная документация

- [gitrevisions(7)](https://git-scm.com/docs/gitrevisions) — полный список синтаксиса ревизий
