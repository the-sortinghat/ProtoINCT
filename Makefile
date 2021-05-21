build:
	@docker-compose build

test_analyser:
	@docker-compose run --rm --no-deps analyser yarn test:dev

start_analyser:
	@docker-compose up analyser

stop_analyser:
	@docker-compose down
