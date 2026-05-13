# `git commit --amend` после push — нужен force push

`git commit --amend` создаёт новый коммит взамен последнего: новый хеш, новый объект. Если коммит уже запушен — remote и локальная история расходятся. Обычный `git push` откажет: "rejected, non-fast-forward". Нужен force push.

## Правильный порядок действий

```bash
# Внести правку (файл или сообщение):
git add src/styles/button.css
git commit --amend --no-edit     # или с новым сообщением

# Force push с проверкой:
git push --force-with-lease origin feature/button
```

`--force-with-lease` проверит, что никто другой не запушил в ветку пока ты работал. Если запушил — push отклонится, и ты не потеряешь чужие коммиты.

## Когда это допустимо

- **Feature-ветка, которую пишешь только ты.** Amend + force push — нормальная практика перед PR.
- **До того как кто-то спулил ветку.** Если коллега уже взял твою ветку — предупреди его (см. [`post-rewrite-protocol`](./post-rewrite-protocol.md)).

## Когда это недопустимо

- **Shared-ветки** (main, develop, release) — никогда без явного согласования команды.
- **После того как PR заапрувлен и смержен** — история уже в продакшне.

## Подвохи

- **Никогда `--force` без `--with-lease`** в ветках, которые видят другие. `--force` перезапишет всё безусловно.
- **`--amend` меняет хеш** даже если изменилось только сообщение или автор. Это новый объект коммита.
- **git hooks на remote** могут запретить force push. Если push отклонён с ошибкой о защищённой ветке — не обходи защиту, поговори с командой.

## Связанное

- [`amend-pitfalls`](./amend-pitfalls.md) — что ещё ломается при amend
- [`force-with-lease-vs-force`](./force-with-lease-vs-force.md) — детали --force-with-lease

## Официальная документация

- [git-commit(1)](https://git-scm.com/docs/git-commit) — флаг --amend
- [git-push(1)](https://git-scm.com/docs/git-push) — --force-with-lease
