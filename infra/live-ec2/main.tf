terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_security_group" "demo_sg" {
  name        = "aikido-demo-sg"
  description = "Aikido demo - intentionally open SSH for CSPM finding"

  ingress {
    description = "SSH open to the world (intentional misconfig for demo)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "aikido-demo-sg"
    Purpose = "aikido-se-demo"
  }
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "demo_host" {
  ami                         = data.aws_ami.amazon_linux_2.id
  instance_type                = "t3.micro"
  vpc_security_group_ids       = [aws_security_group.demo_sg.id]
  associate_public_ip_address  = true
  monitoring                   = false

  # IMDSv1 allowed (no token requirement) - intentional CSPM finding
  metadata_options {
    http_tokens   = "optional"
    http_endpoint = "enabled"
  }

  root_block_device {
    volume_size = 8
    volume_type = "gp2"
    encrypted   = false
  }

  tags = {
    Name    = "aikido-demo-host"
    Purpose = "aikido-se-demo"
  }
}

output "instance_id" {
  value = aws_instance.demo_host.id
}

output "public_ip" {
  value = aws_instance.demo_host.public_ip
}

output "security_group_id" {
  value = aws_security_group.demo_sg.id
}
