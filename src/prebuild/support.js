import { capitalCase } from "text-case";

const INITIALISMS = new Map([
  ["on", "on"],
  ["at", "at"],
  ["in", "in"],
  ["for", "for"],

  ["api", "API"],
  ["sdk", "SDK"],
  ["cli", "CLI"],

  ["ai", "AI"],
  ["id", "ID"],
  ["ui", "UI"],
  ["ux", "UX"],
  ["db", "DB"],
  ["ip", "IP"],
  ["os", "OS"],
  ["vm", "VM"],
  ["ml", "ML"],
  ["dl", "DL"],
  ["qa", "QA"],
  ["rbac", "RBAC"],

  ["iot", "IoT"],

  ["gpu", "GPU"],
  ["cpu", "CPU"],
  ["dns", "DNS"],
  ["sql", "SQL"],
  ["nosql", "NoSQL"],
  ["mq", "MQ"],

  ["devops", "DevOps"],
  ["ci", "CI"],
  ["cd", "CD"],

  ["http", "HTTP"],
  ["https", "HTTPS"],
  ["ssh", "SSH"],
  ["ftp", "FTP"],
  ["ssl", "SSL"],
  ["tls", "TLS"],
  ["cdn", "CDN"],

  ["erp", "ERP"],
  ["hr", "HR"],
  ["crm", "CRM"],
  ["mes", "MES"],
  ["b2b", "B2B"],
  ["b2c", "B2C"],

  ["aad", "AAD"],
  ["ad", "AD"],
  ["vnet", "VNet"],
  ["aks", "AKS"],

  ["aws", "AWS"],
  ["s3", "S3"],
  ["ec2", "EC2"],
  ["eks", "EKS"],
  ["rds", "RDS"],
  ["vpc", "VPC"],
  ["iam", "IAM"],
  ["efs", "EFS"],
  ["fsx", "FSx"],

  ["gke", "GKE"],

  ["sap", "SAP"],
  ["netapp", "NetApp"],
]);

export function normalizeTitle(input) {
  // Split by word boundaries (spaces, hyphens, underscores, etc.)
  const words = input.split(/[\s\-_]+/);
  
  return words.map(word => {
    const lowerWord = word.toLowerCase();
    
    // Check if entire word is in dictionary
    if (INITIALISMS.has(lowerWord)) {
      return INITIALISMS.get(lowerWord);
    }
    
    // Otherwise capitalize first letter only
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}
