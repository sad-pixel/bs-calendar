from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_url: str = ""
    database_dsn: str = ""
    secret_key: str = ""
    port: int = 8000
    host: str = "0.0.0.0"


settings = Settings()
