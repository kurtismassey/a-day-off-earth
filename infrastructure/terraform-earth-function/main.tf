terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)

  project = var.project
  region  = var.region
  zone    = var.zone
}

resource "google_storage_bucket" "bucket" {
  name                        = "${var.project}-gcf-source"
  location                    = "europe-west2"
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "object" {
  name   = "earth-function-source.zip"
  bucket = google_storage_bucket.bucket.name
  source = "earth-function-source.zip"
}

resource "google_cloudfunctions2_function" "function" {
  name     = "earth-image-cf"
  location = var.region

  build_config {
    runtime     = "nodejs20"
    entry_point = "retrieveNasaImage"
    source {
      storage_source {
        bucket = google_storage_bucket.bucket.name
        object = google_storage_bucket_object.object.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60

    secret_environment_variables {
      key = "NASA_KEY"
      project_id = var.project
      secret     = google_secret_manager_secret.secret.secret_id
      version = "latest"
    }
    ingress_settings = "ALLOW_ALL"
  }
  depends_on = [google_secret_manager_secret_version.secret]
}

resource "google_secret_manager_secret" "secret" {
  secret_id = "nasaKey"

  replication {
    user_managed {
      replicas {
        location = "europe-west2"
      }
    }
  }  
}

resource "google_secret_manager_secret_version" "secret" {
  secret = google_secret_manager_secret.secret.name
  secret_data = var.NASA_KEY
  enabled = true
}

output "function_uri" {
  value = google_cloudfunctions2_function.function.service_config[0].uri
}