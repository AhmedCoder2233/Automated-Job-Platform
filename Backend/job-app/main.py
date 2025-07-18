import model
from model import Base, jobPosting, userApplying, SelectedUser
from database import engine, LocalSession
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from schema import jobPost
from sqlalchemy.orm import Session
import json
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def getdb():
    db = LocalSession()
    try:
        yield db
    finally:
        db.close()

@app.post("/jobpost/")
def JobPost(job:jobPost, db:Session = Depends(getdb)):
    data = jobPosting(**job.model_dump())
    db.add(data)
    db.commit()
    db.refresh(data)  
    return {"message": "Data Posted Successfully!"}

@app.get("/jobpost/")
def getJob(db:Session = Depends(getdb)):
    return db.query(jobPosting).all()


@app.post("/userapply/")
async def apply_user(
    name: str = Form(...),
    email: str = Form(...),
    coverLetter: str = Form(""),
    resume: UploadFile = File(...),
    clerk_id:str = Form(...),
    data:str = Form(...),
    ischecked:bool = Form(...),
    is_eligible:bool = Form(...),
    db: Session = Depends(getdb)
):
    file_content = await resume.read()
    parsed_data = json.loads(data)
    new_user = userApplying(
        name=name,
        email=email,
        cover_letter=coverLetter,
        resume=file_content,
        clerk_id = clerk_id,
        data = parsed_data,
        ischecked = ischecked,
        is_eligible = is_eligible
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Application submitted successfully"}

import base64

@app.get("/userapply/")
def getUserInfo(db: Session = Depends(getdb)):
    data = db.query(userApplying).all()
    result = []
    for user in data:
        encoded_resume = base64.b64encode(user.resume).decode("utf-8")
        result.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "cover_letter": user.cover_letter,
            "clerk_id": user.clerk_id,
            "data": user.data,
            "resume_base64": encoded_resume,
            "ischecked": user.ischecked,
            "is_eligible": user.is_eligible
        })
    return result


@app.put("/userapply/{user_id}")
def user_checked_apply(user_id: int, db: Session = Depends(getdb)):
    user = db.query(userApplying).filter(userApplying.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.ischecked = True
    db.commit()
    db.refresh(user)
    return {"message": "User check status updated", "ischecked": user.ischecked}

@app.put("/usereligible/{user_id}")
def user_checked_aval(user_id: int, db: Session = Depends(getdb)):
    user = db.query(userApplying).filter(userApplying.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_eligible = True
    db.commit()
    db.refresh(user)
    return {"message": "User check status updated", "ischecked": user.ischecked}

from schema import SelectedUserSchema  

@app.post("/userselected/")
def userSelected(selected: SelectedUserSchema, db: Session = Depends(getdb)):
    data = SelectedUser(
        score=selected.score,
        secret_key=selected.secret_key,
        data=selected.data.model_dump(),
        email=selected.email
    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return {"message": "User selected data posted successfully"}

@app.get("/selectedUser")
def userSelectedGet(db:Session = Depends(getdb)):
    return db.query(SelectedUser).all()