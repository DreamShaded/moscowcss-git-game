# `--force-with-lease` vs `--force` — безопасный force push

`git push --force` перезаписывает remote-ветку безусловно. Если кто-то запушил в неё пока ты работал — их коммиты будут уничтожены без предупреждения. `--force-with-lease` проверяет: remote-ветка должна быть там, где ты её видел в последний раз. Если кто-то успел запушить — push отклоняется.

"Lease" в названии — буквально "аренда": ты говоришь git, что "арендовал" ветку в определённом состоянии и готов перезаписать её только если она не изменилась.

## Когда это нужно

- После `git commit --amend` на уже запушенной ветке.
- После `git rebase` feature-ветки на актуальный main.
- После интерактивного ребейза для squash/fixup.
- Любой force push в ветку, которую теоретически мог затронуть коллега.

## Как использовать

```bash
git push --force-with-lease origin feature/grid     # безопасный force push
git push --force-with-lease                         # для текущей ветки

# Если push отклонён (кто-то успел запушить):
git fetch origin
git log HEAD..origin/feature/grid    # посмотреть что пришло
# разобраться, потом повторить push
```

## Подвохи

- **`--force-with-lease` можно обмануть через fetch без merge.** Если ты сделал `git fetch` (remote-tracking обновился), но не смержил — lease считает "видел" новый коммит и разрешает push, даже если ты его не учёл. Для этого есть `--force-if-includes`.
- **`--force` в shared-ветке** (main, develop) — почти всегда ошибка. Даже с lease. Используй `git revert` для публичных веток.
- **Lease проверяет remote-tracking ref**, а не живое состояние remote. Если у тебя устаревший `origin/feature` — lease устаревший.
- **На GitHub/GitLab** можно включить защиту ветки от force push вообще — тогда даже `--force-with-lease` не пройдёт.

## Связанное

- [`post-rewrite-team-protocol`](./post-rewrite-team-protocol.md) — что делать команде после force push в shared ветку
- [`amend-after-push`](./amend-after-push.md) — конкретный кейс: amend + force push
- [`revision-syntax-deep`](./revision-syntax-deep.md) — `@{push}` для проверки состояния push-remote

## Официальная документация

- [git-push(1)](https://git-scm.com/docs/git-push) — флаги --force-with-lease и --force-if-includes
