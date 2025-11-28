from fastapi import Request
from fastapi.datastructures import QueryParams


class FixListQueryParamsMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Adapted from https://github.com/fastapi/fastapi/discussions/7827#discussioncomment-5144572
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope)

        # Rebuild params: strip "[]" from keys ending with it
        new_items = [
            (key[:-2] if key and key.endswith("[]") else key, value)
            for key, value in request.query_params.multi_items()
        ]

        scope["query_string"] = bytes(str(QueryParams(new_items)), "ascii")

        await self.app(scope, receive, send)
