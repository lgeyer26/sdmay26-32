build:
	sudo docker compose build --no-cache
up:
	sudo systemctl start apache2
	sudo docker compose up -d
down:
	sudo systemctl stop apache2
	sudo docker compose down
restart:
	sudo docker compose down
	sudo docker compose up -d
react-build:
	npm --prefix Frontend/sd-app/ run build
restart-build:
	sudo docker compose down
	npm --prefix Frontend/sd-app/ run build
	sudo docker compose up -d
