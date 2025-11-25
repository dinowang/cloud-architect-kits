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
  return capitalCase(input, {
    transform: (word, index) => INITIALISMS.get(word.toLowerCase()) ?? word,
  });
}
