terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
  
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

resource "random_id" "project_suffix" {
  byte_length = 3
}

resource "azurerm_resource_group" "main" {
  name     = "rg-${var.codename}-${random_id.project_suffix.hex}"
  location = var.location
  
  tags = {
    Environment = var.environment
    Project     = var.codename
    ManagedBy   = "Terraform"
  }
}

resource "azurerm_static_web_app" "main" {
  name                = "swa-${var.codename}-${random_id.project_suffix.hex}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.swa_location
  sku_tier            = var.sku_tier
  sku_size            = var.sku_size
  
  tags = {
    Environment = var.environment
    Project     = var.codename
    ManagedBy   = "Terraform"
  }
}
