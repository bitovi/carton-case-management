# ECS Task Definition
resource "aws_ecs_task_definition" "main" {
  family                   = "${var.project_name}-${var.environment}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.container_cpu
  memory                   = var.container_memory
  execution_role_arn       = "arn:aws:iam::810329399955:role/ecsTaskExecutionRole"
  task_role_arn            = "arn:aws:iam::810329399955:role/ecsTaskExecutionRole"

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "carton-application-${var.environment}"
      image     = var.container_image
      essential = true
      cpu       = 0
      systemControls = []

      portMappings = [
        {
          name          = "5173"
          containerPort = 5173
          hostPort      = 5173
          protocol      = "tcp"
          appProtocol   = "http"
        },
        {
          name          = "3001"
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]

      environment = [
        {
          name  = "DATABASE_URL"
          value = "file:./db/dev.db"
        },
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]

      mountPoints = []
      volumesFrom = []
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
          "awslogs-create-group"  = "true"
        }
        secretOptions = []
      }
    }
    
  ])
  
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "${var.project_name}-${var.environment}-service"
  cluster         = "arn:aws:ecs:us-east-2:810329399955:cluster/carton-case-management-cluster"
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  wait_for_steady_state = false
  force_new_deployment = true

  network_configuration {
    security_groups  = ["sg-0df8cac4b783cd6fc"]
    subnets          = ["subnet-0decc1bd99c9175cb", "subnet-0c21bfbe6b59df461"]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "carton-application-${var.environment}"
    container_port   = 5173
  }

  enable_execute_command = true

  depends_on = [
    aws_lb_listener.https,
    #aws_iam_role_policy_attachment.ecs_task_execution_policy
  ]

  tags = {
    Name        = "${var.project_name}-${var.environment}-service"
    Environment = var.environment
  }
}
