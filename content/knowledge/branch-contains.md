# `git branch --contains` — в каких ветках есть коммит

`git branch --contains <hash>` показывает все ветки, в которых данный коммит достижим. Это быстрый ответ на вопрос "а хотфикс попал в release/3.2?" без ручного `git log`.

## Как использовать

```bash
# Локальные ветки, содержащие коммит:
git branch --contains abc1234

# Все ветки (локальные + remote-tracking):
git branch -a --contains abc1234

# Только remote-tracking:
git branch -r --contains abc1234

# Теги, содержащие коммит:
git tag --contains abc1234
```

Пример вывода:
```
  main
* feature/grid
  release/3.2
```

Коммит достижим из всех трёх веток — то есть он находится в их истории.

## Когда это нужно

- Проверить, попал ли hotfix в нужные release-ветки.
- Выяснить, на какие ветки повлияет `git revert <hash>`.
- Убедиться, что cherry-pick действительно перенёс коммит.
- Криминалистика: найти все места, куда разошёлся конкретный коммит.

```bash
# Задача H9: проверить хеш по всем release-веткам
git branch -a --contains <fix_hash> | grep release/
```

## Подвохи

- **Проверяет достижимость, не хеш.** Если коммит был cherry-picked с разрешением конфликта, хеш другой — `--contains` не найдёт. Для этого — `git cherry`.
- **После rebase** оригинальные хеши исчезают. `--contains` ищет новые хеши (после ребейза).
- **`git log --oneline branch1 branch2 branch3 | grep <hash>`** — более медленная альтернатива для нескольких конкретных веток.

## Связанное

- [`cherry-tool`](./cherry-tool.md) — `git cherry` для проверки через patch-id (работает при разных хешах)
- [`pickaxe-vs-grep`](./pickaxe-vs-grep.md) — поиск по содержимому изменений, не по хешу

## Официальная документация

- [git-branch(1)](https://git-scm.com/docs/git-branch) — флаг --contains
- [git-tag(1)](https://git-scm.com/docs/git-tag) — флаг --contains для тегов
