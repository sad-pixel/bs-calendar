from sqlalchemy import create_engine

from db.queries import Querier

engine = create_engine(
    "sqlite:///database.db",
    echo=True,
    future=True,  # Use the new future API
)


def get_querier():
    with engine.begin() as conn:
        yield Querier(conn)
