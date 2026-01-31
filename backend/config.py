from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Default values add kar di hain taake validation error khatam ho jaye
    database_url:str = "postgresql+asyncpg://neondb_owner:npg_sjvwW8I4zORl@ep-square-boat-aho0nl6y-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    sync_database_url: str = "postgresql+psycopg2://neondb_owner:npg_sjvwW8I4zORl@ep-square-boat-aho0nl6y-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    db_echo: bool = False

    better_auth_secret: str  = "YbYzhFCNlBWV2VUlOp9kzH16ornY4kiF" # Default value
    secret_key  :str  = "uG4GOZ-kL2sN6ULOMSIZV_NKHx3KAW1LFffSSy5IjrY"        # Default value
    
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


# Create settings instance
settings = Settings()