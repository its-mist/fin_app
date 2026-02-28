#!/usr/bin/env bash
# Первичная настройка SSL через Let's Encrypt.
# Запуск: ./init-letsencrypt.sh your@email.com
set -e

DOMAIN="fin.mist.press"
EMAIL="${1:?Укажите email: ./init-letsencrypt.sh your@email.com}"

echo "==> [1/5] Генерируем временный самоподписанный сертификат..."
mkdir -p ./certbot/conf/live/$DOMAIN ./certbot/www
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout ./certbot/conf/live/$DOMAIN/privkey.pem \
  -out    ./certbot/conf/live/$DOMAIN/fullchain.pem \
  -subj "/CN=localhost" 2>/dev/null

echo "==> [2/5] Запускаем nginx с временным сертификатом..."
# Подключаем HTTPS-конфиг (он уже ссылается на сертификат)
cp ./nginx/conf.d/app-ssl.conf ./nginx/conf.d/app.conf
docker compose up -d --build nginx backend

echo "==> [3/5] Ждём запуска nginx (10 сек)..."
sleep 10

echo "==> [4/5] Получаем настоящий сертификат от Let's Encrypt..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN"

echo "==> [5/5] Перезагружаем nginx с реальным сертификатом..."
docker compose exec nginx nginx -s reload

echo "==> Запускаем certbot для автопродления..."
docker compose up -d certbot

echo ""
echo "✓ Готово! Приложение доступно на https://$DOMAIN"
