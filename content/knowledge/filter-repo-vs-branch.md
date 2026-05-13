# `git filter-repo` vs `git filter-branch` — чистка истории

Иногда нужно удалить файл из всей истории репозитория — например, случайно закоммиченные секреты, большой бинарный файл, или проприетарный ассет. Для этого есть два инструмента: старый `git filter-branch` и современный `git filter-repo`.

## Почему filter-repo, а не filter-branch

`git filter-branch` — встроенный, но медленный и опасный в использовании. Сам git предупреждает о нём: с 2.36+ при вызове выводится предупреждение с рекомендацией использовать filter-repo.

`git filter-repo` — сторонний инструмент (устанавливается отдельно), в 10–100 раз быстрее, с понятным синтаксисом и защитой от типичных ошибок.

## Установка filter-repo

```bash
pip install git-filter-repo
# или через пакетный менеджер:
brew install git-filter-repo      # macOS
apt install git-filter-repo       # Ubuntu 22.04+
```

## Основные операции

```bash
# Удалить файл из всей истории
git filter-repo --path .env --invert-paths

# Удалить директорию
git filter-repo --path secrets/ --invert-paths

# Оставить только определённую поддиректорию (извлечь поддерево)
git filter-repo --subdirectory-filter src/

# Переименовать файл по всей истории
git filter-repo --path-rename old-name.css:new-name.css
```

После filter-repo нужен force push:

```bash
git push --force --all
git push --force --tags
```

## Подвохи

- **filter-repo требует чистого clone** или явного флага `--force`. Работай в свежем `git clone --mirror` или передай `--force` если знаешь что делаешь.
- **После filter-repo все хеши меняются.** Это полная перезапись истории — все участники должны сделать свежий clone, не rebase поверх старого.
- **Ротация секретов обязательна.** Даже после удаления из истории, закоммиченные секреты считаются скомпрометированными — их нужно отозвать и перевыпустить.
- **GitHub кэширует** старые объекты на своих серверах. После filter-repo обратись в поддержку для полной очистки кэша, если критично.

## Связанное

- [`bfg-alternative`](./bfg-alternative.md) — BFG Repo-Cleaner как альтернатива для простых случаев
- [`post-rewrite-team-protocol`](./post-rewrite-team-protocol.md) — что должна сделать команда после перезаписи истории

## Официальная документация

- [git-filter-repo](https://github.com/newren/git-filter-repo) — репозиторий и документация
- [git-filter-branch(1)](https://git-scm.com/docs/git-filter-branch) — старый инструмент (не рекомендуется)
