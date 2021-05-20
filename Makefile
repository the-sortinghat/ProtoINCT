build:
	@docker-compose build

start_analyser:
	@docker-compose up analyser

stop_analyser:
	@docker-compose down
