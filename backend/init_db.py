import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
from config import settings

# Database URL se query parameters (? ke baad wala hissa) hatane ke liye
base_url = settings.database_url.split('?')[0]

async_engine = create_async_engine(
    base_url,
    echo=True,
    # Agar online DB hai toh niche wali line un-comment karein
    # connect_args={"ssl": True} 
)

async def create_db_and_tables():
    print(f"Connecting to database at: {base_url}")
    try:
        async with async_engine.begin() as conn:
            # Tables create karne ki koshish
            await conn.run_sync(SQLModel.metadata.create_all)
        print("SUCCESS: Database initialized!")
    except Exception as e:
        print(f"FAILED to initialize database: {e}")
        # Server ko crash hone se bachane ke liye raise hata sakte hain testing ke waqt
        # raise e 

if __name__ == "__main__":
    asyncio.run(create_db_and_tables())