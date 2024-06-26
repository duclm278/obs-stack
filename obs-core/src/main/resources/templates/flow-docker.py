import contextlib
import os
from datetime import datetime

from airflow import models
from airflow.providers.docker.operators.docker import DockerOperator
from docker.types import Mount


def main():
    execute = DockerOperator(
        task_id="run_notebook",
        image="[(${image})]",
        command="jupyter nbconvert --to notebook --execute /home/jovyan/work/[(${id})].ipynb",
        docker_url="[(${docker_url})]",
        network_mode="bridge",
        mounts=[
            Mount(
                source=f"{os.getenv('SOURCE_DIR')}/dags/[(${id})].ipynb",
                target="/home/jovyan/work/[(${id})].ipynb",
                type="bind",
            )
        ],
        auto_remove=True,
    )

    execute


with models.DAG(
    dag_id="[(${id})]",
    schedule="[(${schedule})]",
    start_date=datetime(2020, 1, 1),
    catchup=False,
) as dag:
    with contextlib.suppress(AttributeError):
        main()
