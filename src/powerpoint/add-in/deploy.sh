#!/bin/bash

set -e

echo "========================================="
echo "PowerPoint Cloud Architect - Deployment"
echo "========================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "Error: Must run from add-in directory"
  exit 1
fi

# Step 1: Copy icons from Figma plugin
echo ""
echo "Step 1: Copying icons from Figma plugin..."
if [ -d "../../figma-cloudarchitect/icons" ]; then
  cp -r ../../figma-cloudarchitect/icons ./icons
  cp ../../figma-cloudarchitect/icons.json ./icons.json
  echo "✓ Icons copied successfully"
else
  echo "⚠ Warning: Figma plugin icons not found. Please build Figma plugin first."
  echo "  Run: cd ../../figma-cloudarchitect && npm run build"
  exit 1
fi

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing dependencies..."
npm install
echo "✓ Dependencies installed"

# Step 3: Build the add-in
echo ""
echo "Step 3: Building add-in..."
npm run build
echo "✓ Build complete"

# Step 4: Check if Terraform is available
echo ""
echo "Step 4: Infrastructure deployment (Terraform)..."
if command -v terraform &> /dev/null; then
  echo "Terraform found. Do you want to deploy infrastructure? (y/n)"
  read -r deploy_infra
  
  if [ "$deploy_infra" = "y" ]; then
    cd ../terraform
    
    echo "Initializing Terraform..."
    terraform init
    
    echo "Planning deployment..."
    terraform plan -out=tfplan
    
    echo ""
    echo "Review the plan above. Apply changes? (y/n)"
    read -r apply_changes
    
    if [ "$apply_changes" = "y" ]; then
      terraform apply tfplan
      
      echo ""
      echo "========================================="
      echo "Infrastructure deployed successfully!"
      echo "========================================="
      echo ""
      echo "Static Web App URL:"
      terraform output static_web_app_url
      echo ""
      echo "Deployment Token (save this for deployment):"
      terraform output -raw static_web_app_api_key
      echo ""
      echo ""
      
      # Save outputs to file
      echo "Saving deployment info to ../deployment-info.txt..."
      {
        echo "PowerPoint Cloud Architect - Deployment Info"
        echo "============================================"
        echo ""
        echo "Deployed at: $(date)"
        echo ""
        echo "Static Web App URL:"
        terraform output -raw static_web_app_url
        echo ""
        echo ""
        echo "Deployment Token:"
        terraform output -raw static_web_app_api_key
        echo ""
        echo ""
        echo "Resource Group:"
        terraform output -raw resource_group_name
        echo ""
        echo ""
        echo "Next Steps:"
        echo "1. Update manifest.xml with the Static Web App URL"
        echo "2. Deploy application using: npm install -g @azure/static-web-apps-cli"
        echo "3. Run: swa deploy --app-location . --output-location . --deployment-token <TOKEN>"
      } > ../deployment-info.txt
      
      echo "✓ Deployment info saved to deployment-info.txt"
    else
      echo "Deployment cancelled"
    fi
    
    cd ..
  else
    echo "Skipping infrastructure deployment"
  fi
else
  echo "⚠ Terraform not found. Skipping infrastructure deployment."
  echo "  Install Terraform: https://www.terraform.io/downloads.html"
fi

# Step 5: Instructions
echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. If you deployed infrastructure, update manifest.xml with your Static Web App URL"
echo "2. Deploy application:"
echo "   npm install -g @azure/static-web-apps-cli"
echo "   swa deploy --app-location . --output-location . --deployment-token <TOKEN>"
echo "3. For local development:"
echo "   npm run serve"
echo "   Then sideload manifest.xml in PowerPoint"
echo ""
echo "For more information, see README.md"
