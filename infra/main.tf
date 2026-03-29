module "cs-backend-ecr" {
  source = "./modules/ecr"
  repository_name = "crop-sense-backend"
}
module "cs-frontend-ecr" {
  source = "./modules/ecr"
  repository_name = "crop-sense-frontend"
}