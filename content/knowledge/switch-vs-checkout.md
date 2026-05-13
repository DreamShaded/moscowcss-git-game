# `git switch` vs `git checkout` — навигация по веткам

`git checkout` исторически делал слишком много: переключал ветки, создавал ветки, восстанавливал файлы. С git 2.23 функционал разделили: `git switch` — только навигация по веткам, `git restore` — только восстановление файлов.

Эта статья — про навигацию (switch). Про восстановление файлов — [`restore-vs-checkout`](./restore-vs-checkout.md).

## Эквиваленты для переключения веток

```bash
# Переключить ветку:
git switch main
git checkout main           # старый вариант, работает

# Создать и переключить:
git switch -c feature/new
git checkout -b feature/new # старый вариант

# Переключить на предыдущую ветку:
git switch -
git checkout -              # то же

# Создать ветку от конкретной точки:
git switch -c hotfix/nav main
git checkout -b hotfix/nav main   # старый вариант

# Переключить в detached HEAD (на коммит, а не ветку):
git switch --detach abc123
git checkout abc123          # старый вариант
```

## Ключевые отличия `switch` от `checkout`

**`switch` явно разграничивает ветки и файлы.** Нельзя случайно написать `git switch styles.css` вместо `git restore styles.css` — switch выдаст ошибку.

**`switch` откажется переключить** при dirty worktree, если изменения конфликтуют с целевой веткой. `checkout` иногда делал молчаливый merge — `switch` требует явного решения: stash или commit.

**`switch --detach`** явно указывает на detached HEAD, исключая неожиданные переходы в detached state.

## Подвохи

- **В скриптах** предпочтительнее `git checkout` — он есть во всех версиях git. `switch` доступен с 2.23 (2019), но старые окружения могут его не иметь.
- **`git checkout <file>`** восстанавливает файл — это не навигация. В новом синтаксисе: `git restore <file>`.
- **`git checkout --orphan`** не имеет аналога в `switch` — для создания ветки без истории пока нужен `checkout`.

## Связанное

- [`restore-vs-checkout`](./restore-vs-checkout.md) — `git restore` для восстановления файлов
- [`switch-dash-aliases`](./switch-dash-aliases.md) — `switch -` и другие shortcuts

## Официальная документация

- [git-switch(1)](https://git-scm.com/docs/git-switch) — полный референс
- [git-checkout(1)](https://git-scm.com/docs/git-checkout) — исторический референс
