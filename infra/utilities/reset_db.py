"""
Script is used to reset and reseed the database for the Bitovi Carton Case Management app.
Run with `python db_reset.py --environment <staging|prod>
"""

import argparse
import boto3


# Using argparse for this is a bit of overkill, but used fore ease of future expansion 
parser = argparse.ArgumentParser(
                    prog='db_reset',
                    description="Resets and reseeds the database for Bitovi's Carton Case \
                            Management app"
                    )
parser.add_argument("--environment",
                    help = "Environment to reset -- Either production or staging",
                    default = "staging")

client = boto3.client('ecs')

def main(environment: str) -> None:
        """
        This function simply retrieves the ECS Task Name and runs `npn run db:setup` on the
        task's container.
        
        environment: str: 
        """
    cluster_name = "carton-case-management-cluster"
    service_name = f"carton-case-mgmt-{environment}-service"
    task = client.list_tasks(cluster=cluster_name, serviceName=service_name)["taskArns"][0]
    response = client.execute_command(
            cluster = cluster_name,
            task = task,
            command = "npm run db:setup",
            interactive = True
            )
    print(task)
    print(response)

if __name__ == "__main__":
    args = parser.parse_args()
    if args.environment in ["production", "staging"]:
        environment = args.environment
    else:
        environment = "staging"
    main(environment)
