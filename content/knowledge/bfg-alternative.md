# BFG Repo-Cleaner — быстрая очистка истории

BFG — альтернатива `git filter-repo` для удаления секретов и больших файлов из истории. Написан на Scala, работает быстро, удобен для самых частых кейсов: удалить конкретный файл или все файлы крупнее N мегабайт.

Для сложных случаев (переименование, фильтрация по содержимому, извлечение поддиректории) лучше `git filter-repo` — BFG менее гибок.

## Установка

```bash
# Скачать jar с сайта
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar -O bfg.jar
# Нужна Java
```

## Основные операции

```bash
# Подготовка: работай с bare clone
git clone --mirror https://github.com/org/repo.git repo.git
cd repo.git

# Удалить конкретный файл из всей истории
java -jar bfg.jar --delete-files .env

# Удалить все файлы крупнее 10 МБ
java -jar bfg.jar --strip-blobs-bigger-than 10M

# Заменить строки (например, пароль) во всей истории
java -jar bfg.jar --replace-text passwords.txt

# После BFG — очистить и запушить
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

## BFG vs filter-repo

| | BFG | filter-repo |
|---|---|---|
| Установка | Java + jar | Python pip |
| Скорость | Очень быстро | Быстро |
| Простые кейсы | Удобнее | Чуть сложнее |
| Гибкость | Ограничена | Полная |
| Защита текущего HEAD | Не трогает | Настраиваемо |

BFG по умолчанию **не трогает текущий HEAD** — только историю. Это значит, что если `.env` есть в последнем коммите, BFG его не удалит оттуда. Нужно сначала убрать файл из HEAD вручную.

## Подвохи

- **Нужна Java.** На некоторых машинах это неудобно — тогда filter-repo проще.
- **После BFG обязателен `git gc --prune=now`** для фактического удаления объектов из базы.
- **Все хеши меняются**, как и с filter-repo. Команда должна сделать свежий clone.
- **Ротируй секреты.** Удаление из истории не отменяет факт компрометации.

## Связанное

- [`filter-repo-vs-branch`](./filter-repo-vs-branch.md) — `git filter-repo` как основной инструмент чистки
- [`post-rewrite-team-protocol`](./post-rewrite-team-protocol.md) — что делает команда после перезаписи истории

## Официальная документация

- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) — сайт с документацией и примерами
