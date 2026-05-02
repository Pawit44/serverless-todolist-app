output "inventory_path" {
  description = "Path to the generated Ansible inventory"
  value       = local_file.ansible_inventory.filename
}
