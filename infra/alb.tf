# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-elb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = ["sg-0df8cac4b783cd6fc"]
  subnets            = ["subnet-094f902f20ff8faa7", "subnet-031da644ec62d1978"]

  enable_deletion_protection       = false
  enable_cross_zone_load_balancing = true
  enable_http2                     = true
  ip_address_type                  = "ipv4"

  tags = {
    Name        = "${var.project_name}-${var.environment}-elb"
    Environment = var.environment
  }
}

# Target Group
resource "aws_lb_target_group" "main" {
  name        = "${var.project_name}-${var.environment}-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = "vpc-03c2940272ec870fc"
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 30
    path                = "/"
    protocol            = "HTTP"
    port                = "5173"
    matcher             = "200"
  }

  deregistration_delay = 300

  stickiness {
    enabled         = false
    type            = "lb_cookie"
    cookie_duration = 86400
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-tg"
    Environment = var.environment
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-Res-PQ-2025-09"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# HTTP Listener (optional - redirects to HTTPS)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
