provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "demo_bucket" {
  bucket = "aikido-demo-task-tracker"
  acl    = "public-read"
}

resource "aws_db_instance" "demo_db" {
  identifier        = "aikido-demo-db"
  engine            = "mysql"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  username          = "admin"
  password          = "Password123!"
  publicly_accessible = true
  storage_encrypted   = false
}

resource "aws_security_group" "demo_sg" {
  name = "aikido-demo-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
