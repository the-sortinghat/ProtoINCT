build:
	@docker-compose build

test_analyser:
	@docker-compose run --rm --no-deps analyser yarn test:dev

start_analyser:
	@docker-compose up analyser

stop:
	@docker-compose down

start_frontend:
	@docker-compose up frontend
