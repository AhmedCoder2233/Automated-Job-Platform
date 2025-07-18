from database import Base
from sqlalchemy import Column, String, Integer, LargeBinary, JSON, Boolean,DateTime

class jobPosting(Base):
    __tablename__ = "jobPost"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    requirements = Column(String, nullable=False)
    location = Column(String, nullable=False)
    clerk_id = Column(String, nullable=True)
    user_email = Column(String, nullable=True)

class userApplying(Base):
    __tablename__ = "userapplying"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    cover_letter = Column(String, nullable=False)
    resume = Column(LargeBinary, nullable=False)
    clerk_id = Column(String, nullable=True)
    data = Column(JSON, nullable=True)
    ischecked = Column(Boolean, nullable=True)
    is_eligible = Column(Boolean, nullable=True)

class SelectedUser(Base):
    __tablename__ = "selectedUser"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Integer, nullable=False)
    secret_key = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    email = Column(String, nullable=False)

class ChatLog(Base):
    __tablename__ = "chatlog"

    id = Column(Integer, primary_key=True, index=True)
    userMessage = Column(String, nullable=False)
    sender = Column(String, nullable=False)  
    timestamp = Column(DateTime, nullable=False)
    secret_key = Column(String, nullable=False)
    email = Column(String, nullable=False)

class SaveSummaryData(Base):
    __tablename__ = "savesummary"

    id = Column(Integer, primary_key=True, index=True)
    summary = Column(String, nullable=False)
    secret_key = Column(String, nullable=False)
    email = Column(String, nullable=False)