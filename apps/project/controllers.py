"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email
from py4web.utils.form import Form, FormStyleBulma
from py4web.utils.grid import Grid, GridClassStyleBulma
from .helpers import GridActionButton

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth, url_signer)
def index():
    return dict(
        # COMPLETE: return here any signed URLs you need.
        my_callback_url = URL('my_callback', signer=url_signer),
    )

@action('checklist')
@action.uses('checklist.html', db, auth, url_signer)
def checklist():
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        load_data_url = URL('load_data', signer=url_signer),
        save_checklist_url = URL('save_checklist', signer=url_signer),
    )

@action('load_data', method="GET")
@action.uses(db, auth)
def load_data():
    species_list = db(db.species).select().as_list()
    return dict(species = species_list)

@action('save_checklist', method="POST")
@action.uses(db, auth)
def save_checklist():
    id = db.checklist.insert(
        location = {},
        content = request.json.get('content')
    )
    cl = db(db.checklist.id == id).select().first()
    cl.update_record(event_id = str(id))
    return dict(id=id)

@action('my_callback')
@action.uses() # Add here things like db, auth, etc.
def my_callback():
    # The return value should be a dictionary that will be sent as JSON.
    return dict(my_value=3)

@action('location/<path:path>',method=['POST','GET'])
@action('location',method=['POST','GET'])
@action.uses('location.html',db,auth)
def location(path=None):
    return dict(location_data =  URL('get_location_data'))


@action('get_location_data',method=['GET'])
def location_data():
    checklist_list = db(db.checklist).select().as_list()
    coord_list = []
    for i in checklist_list:
        data = json.loads(i['location'])
        lat = float(data['latitude'])
        long = float(data['longitude'])
        coordinate = (lat,long)
        coord_list.append(coordinate)
    
    address = get_country(coord_list)

    for i,j in zip(checklist_list,address):
        i['cc'] = j['cc']

    return dict(data = checklist_list)
