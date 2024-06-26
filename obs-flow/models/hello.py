import contextlib
import os
from datetime import datetime

from airflow import models
from airflow.providers.docker.operators.docker import DockerOperator
from docker.types import Mount


def main():
    execute = DockerOperator(
        task_id="run_notebook",
        image="duclm278/prophet:python-3.11",
        command="jupyter nbconvert --to notebook --execute /home/jovyan/work/hello.ipynb",
        docker_url="tcp://docker-socket-proxy:2375",
        network_mode="bridge",
        mounts=[
            Mount(
                source=f"{os.getenv('SOURCE_DIR')}/dags/hello.ipynb",
                target="/home/jovyan/work/hello.ipynb",
                type="bind",
            )
        ],
        auto_remove=True,
    )

    execute


with models.DAG(
    dag_id="dag-1",
    schedule=None,
    start_date=datetime(2020, 1, 1),
    catchup=False,
) as dag:
    with contextlib.suppress(AttributeError):
        main()
