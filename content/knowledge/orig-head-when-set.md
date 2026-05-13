# `ORIG_HEAD` — автоматический бэкап перед опасными операциями

Когда ты делаешь `git reset`, `merge`, `rebase` или `pull`, git **автоматически** сохраняет позицию, на которой ветка была *до* операции, под именем `ORIG_HEAD`. Это бесплатная страховка: если что-то пошло не так — `git reset --hard ORIG_HEAD` вернёт всё как было.

`ORIG_HEAD` — это обычный ref (указатель на коммит), просто с зарезервированным именем. Лежит в `.git/ORIG_HEAD`. Перезаписывается при каждой следующей опасной операции.

## Когда это нужно

Самый частый кейс: ты сделал `git reset --hard HEAD~5` и потерял пять коммитов. Если это была последняя операция в репо — `git reset --hard ORIG_HEAD` мгновенно их вернёт.

Ещё кейс: запустил `git rebase main`, на середине ребейза понял, что зря. `git rebase --abort` уже не вариант (например, ты сделал коммит посередине). А `git reset --hard ORIG_HEAD` — да, потому что ORIG_HEAD указывает на позицию ветки *до* старта rebase.

И ещё: после `git pull`, который оказался не тем, чего ты ждал — `git reset --hard ORIG_HEAD` откатит всё, что pull натянул.

## Как использовать

```bash
git reset --hard ORIG_HEAD       # вернуть ветку на позицию до последней опасной операции
git diff ORIG_HEAD               # посмотреть, что изменилось с того момента
git log ORIG_HEAD..HEAD          # список новых коммитов после операции
```

## Подвохи

- **`ORIG_HEAD` перезаписывается.** Если ты сделал `git reset --hard HEAD~5`, потом ещё `git merge feature` — `ORIG_HEAD` уже указывает на состояние перед merge, а не перед reset. Чтобы добраться до того, что было перед reset, нужен `git reflog`.
- **`ORIG_HEAD` устанавливается не всегда.** `git switch`, `git checkout` для смены ветки, `git commit` его не трогают. Только `reset`, `merge`, `rebase`, `pull`, `cherry-pick`.
- **Это про ветку, не про worktree.** `ORIG_HEAD` — указатель на коммит. Если перед reset у тебя в worktree были незакоммиченные изменения и ты сделал `reset --hard`, они потеряны — даже `ORIG_HEAD` не поможет.

## Связанное

- [`reflog-mechanics`](./reflog-mechanics.md) — универсальный способ восстановления, работает даже когда `ORIG_HEAD` уже перезаписан
- [`automatic-refs`](./automatic-refs.md) — обзор других автоматических refs: `MERGE_HEAD`, `FETCH_HEAD`, `HEAD@{n}`
- [`reset-soft-mixed-hard`](./reset-soft-mixed-hard.md) — три режима reset, разница между ними

## Официальная документация

- [gitrevisions(7)](https://git-scm.com/docs/gitrevisions) — формальное определение в разделе про "specifying revisions"
- [git-reset(1)](https://git-scm.com/docs/git-reset) — полный референс reset
