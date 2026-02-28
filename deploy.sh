#!/usr/bin/env bash
# Обновление приложения после изменений в репозитории.
# Запуск: ./deploy.sh
set -e

echo "==> Получаем последние изменения..."
git pull

echo "==> Пересобираем и перезапускаем контейнеры..."
docker compose up -d --build nginx backend

echo "✓ Готово!"
