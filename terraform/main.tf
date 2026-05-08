terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4.0"
    }
  }
}

provider "docker" {}
# 1. สร้าง Network จริงๆ (Provisioning) 
resource "docker_network" "todo_network" {
  name = "todo-app-network-${var.environment}"
}

# 2. สร้าง Inventory ให้ Ansible 
resource "local_file" "ansible_inventory" {
  content  = "[local]\nlocalhost ansible_connection=local\n"
  filename = "${path.module}/../ansible/inventory"
}