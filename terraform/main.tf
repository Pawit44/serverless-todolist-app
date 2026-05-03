terraform {
  required_providers {
    local = {
      source = "hashicorp/local"
      version = "~> 2.4.0"
    }
  }
}

# ให้ Terraform สร้างไฟล์ Inventory สำหรับ Ansible
resource "local_file" "ansible_inventory" {
  content  = "[local]\nlocalhost ansible_connection=local\n"
  filename = "${path.module}/../ansible/inventory"
}
