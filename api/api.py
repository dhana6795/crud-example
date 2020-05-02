import time
from flask import Flask
from flask import request
import sqlalchemy
import fdb
from sqlalchemy import create_engine
import json

app = Flask(__name__)
engine = create_engine('<db url>')
engine.connect()
session = engine
@app.route('/get')
def get_employees():
    emp =  session.execute("select * from Employee")
    emp_list = []
    for row in emp:
        emp_list.append({'id': row['id'], 'name': row['name'], 'designation': row['desgnation'], 'image': row['image_url']})
    return {'emp': json.dumps(emp_list)}

@app.route('/save', methods=["POST"])
def save():
    session.execute("insert into Employee (name, desgnation, image_url) values ('"+ request.form.get('name')+"','"+request.form.get('desg')+ "','"+request.form.get('imageUrl') +"')")
    
    return {'status':'record created successfully!!!'}

@app.route('/update', methods=["POST"])
def update():
    session.execute("UPDATE Employee set name = '" + request.json.get('name') + "'," + "desgnation = '" + request.json.get('designation')+ "', image_url = '" + request.json.get('image')+ "' where id ="+str(request.json.get('id')))    
    return {'status':'record updated successfully!!!'}


@app.route('/delete', methods=["DELETE"])
def delete():
    session.execute("delete from Employee where id ="+ str(request.args.get('id')))
    return {'status':'record deleted.'}