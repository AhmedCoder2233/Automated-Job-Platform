from pydantic import BaseModel
from typing import Dict

class jobPost(BaseModel):
    title:str
    description:str
    requirements:str
    location:str
    clerk_id:str
    user_email:str


class SelectedUserSchema(BaseModel):
    score: int
    secret_key: str
    data: jobPost
    email:str

class summarySchema(BaseModel):
    summary:str
    secret_key:str
    email:str
