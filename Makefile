build:
	@docker-compose build

start_analyser:
	@docker-compose up analyser

start_collector:
	@docker-compose up collector

stop:
	@docker-compose down 
