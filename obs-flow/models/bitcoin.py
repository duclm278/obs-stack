import logging
from datetime import datetime

import requests
from airflow import DAG
from airflow.decorators import task

API = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true"


def main():
    @task(task_id="extract", retries=2)
    def extract_bitcoin_price():
        return requests.get(API).json()["bitcoin"]

    @task(multiple_outputs=True)
    def process_data(response):
        logging.info(response)
        return {"usd": response["usd"], "change": response["usd_24h_change"]}

    @task
    def store_data(data):
        logging.info(f"Store: {data['usd']} with change {data['change']}")

    store_data(process_data(extract_bitcoin_price()))


with DAG(
    dag_id="main",
    schedule_interval="@daily",
    start_date=datetime(2021, 12, 1),
    catchup=False,
) as dag:
    main()
