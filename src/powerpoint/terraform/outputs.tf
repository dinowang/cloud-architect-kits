output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "Resource group name"
}

output "static_web_app_name" {
  value       = azurerm_static_web_app.main.name
  description = "Static Web App name"
}

output "static_web_app_default_hostname" {
  value       = azurerm_static_web_app.main.default_host_name
  description = "Static Web App default hostname"
}

output "static_web_app_url" {
  value       = "https://${azurerm_static_web_app.main.default_host_name}"
  description = "Static Web App full URL"
}

output "static_web_app_api_key" {
  value       = azurerm_static_web_app.main.api_key
  description = "Static Web App deployment token"
  sensitive   = true
}

output "project_suffix" {
  value       = random_id.project_suffix.hex
  description = "Random suffix for resource naming"
}
