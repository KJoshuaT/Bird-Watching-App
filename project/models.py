"""
This file defines the database models
"""

import datetime
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

# Sightings table
db.define_table('sighting',
    Field('checklist_id', 'reference checklist'),
    Field('species_id', 'reference species'),
    Field('number_seen', 'integer', default=1, requires=IS_INT_IN_RANGE(1, None))
)

db.commit()
