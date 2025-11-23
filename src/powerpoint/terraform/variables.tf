variable "codename" {
  type        = string
  description = "Project codename"
  default     = "pptcloudarch"
}

variable "location" {
  type        = string
  description = "Azure region for resources"
  default     = "East Asia"
}

variable "swa_location" {
  type        = string
  description = "Azure Static Web App location"
  default     = "East Asia"
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "production"
}

variable "sku_tier" {
  type        = string
  description = "Static Web App SKU tier"
  default     = "Free"
}

variable "sku_size" {
  type        = string
  description = "Static Web App SKU size"
  default     = "Free"
}
