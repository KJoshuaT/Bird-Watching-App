"""
This file defines the database models
"""

import datetime, csv, json
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()

### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later

# Species table
db.define_table('species',
    Field('name', 'string', requires=[IS_NOT_EMPTY(), IS_NOT_IN_DB(db, 'species.name')]),
)

# Checklist table
db.define_table('checklist',
    Field('checklist_id', 'string', requires=IS_NOT_EMPTY(), unique=True),
    Field('location', 'json', requires=IS_NOT_EMPTY()),
    Field('created_on', 'datetime', default=get_time),
    Field('user_id', default=get_user_email),
)

# Sightings table
db.define_table('sighting',
    Field('checklist_id', 'reference checklist'),
    Field('species_id', 'reference species'),
    Field('number_seen', 'integer', default=1, requires=IS_INT_IN_RANGE(1, None))
)

if db(db.checklist).isempty():
    with open("apps/project/checklists.csv") as f:
        csv_reader = csv.reader(f)
        next(csv_reader) # Skip the header
        for row in csv_reader:
            if row[4] == '':
                row[4] = '00:00:00'
            db.checklist.insert(
                checklist_id=row[0],
                location= json.dumps({'latitude': row[1], 'longitude': row[2]}),
                created_on= datetime.datetime.strptime(f"{row[3]} {row[4]}", '%Y-%m-%d %H:%M:%S'),
                user_id= row[5],
            )

db.commit()
