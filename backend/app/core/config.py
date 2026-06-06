from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings loaded from environment variables."""

    app_name: str = "MercurIA Backend"
    app_version: str = "0.1.0"
    demo_mode: bool = True
    model_version: str = "derrama-demo-1.0"
    anthropic_api_key: str | None = None
    anthropic_model: str = "claude-sonnet-4-20250514"
    anthropic_max_tokens: int = 700
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def anthropic_configured(self) -> bool:
        return bool(self.anthropic_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()
