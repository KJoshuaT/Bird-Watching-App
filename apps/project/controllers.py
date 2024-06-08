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
from py4web.utils.grid import Grid, GridClassStyleBulma, Column
from .helpers import GridActionButton

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth, url_signer)
def index():
    return dict(
        # COMPLETE: return here any signed URLs you need.
        my_callback_url = URL('my_callback', signer=url_signer),
    )

@action('checklist/<checklist_id>')
@action.uses('checklist.html', db, auth, url_signer)
def checklist(checklist_id):
    logged_in = "True"
    if not auth.get_user():
        logged_in = "False"
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        load_data_url = URL('load_data', signer=url_signer),
        save_checklist_url = URL('save_checklist', signer=url_signer),
        update_checklist_url = URL('update_checklist', signer=url_signer),
        get_checklist_url = URL('get_checklist', signer=url_signer),
        checklist_id = checklist_id,
        logged_in = logged_in
    )
    
@action('my_checklists/<path:path>', method=['POST','GET'])
@action('my_checklists', method=['POST','GET'])
@action.uses('my_checklists.html', db, auth, url_signer)
def my_checklists(path = None):
    columns = [
        db.checklist.name,
        db.checklist.event_id,
        db.checklist.created_on
        ]
    post_action_buttons = [
        lambda row: GridActionButton(
            url = URL('checklist', row.event_id),
            text="Edit Checklist",
            icon="fa-pencil-square-o ",
            additional_classes="button confirmation is-small",
    )
    ]
    grid = Grid(path,
                formstyle= FormStyleBulma,
                grid_class_style=GridClassStyleBulma,
                columns=columns,
                query = (db.checklist.user_id == get_user_email),
                orderby = ~db.checklist.created_on,
                create=False,
                details=False,
                editable=False,
                pre_action_buttons=post_action_buttons,
                headings = ['Checklist Title', 'Checklist ID', 'Created On']
                )
    return dict(
            grid = grid,
            my_callback_url = URL('my_callback', signer=url_signer),
            load_data_url = URL('load_data', signer=url_signer),
            save_checklist_url = URL('save_checklist', signer=url_signer))

@action('load_data', method="GET")
@action.uses(db, auth)
def load_data():
    species_list = db(db.species).select().as_list()
    checklist_list = db(db.checklist).select().as_list()
    return dict(species = species_list, checklists = checklist_list)

@action('save_checklist', method="POST")
@action.uses(db, auth)
def save_checklist():
    id = db.checklist.insert(
        location = {},
        content = request.json.get('checklist'),
        name = request.json.get('name')
    )
    cl = db(db.checklist.id == id).select().first()
    cl.update_record(event_id = str(id))
    return dict(id=id)

@action('update_checklist', method="POST")
@action.uses(db, auth)
def update_checklist():
    event_id = request.json.get('event_id')
    content = request.json.get('checklist')
    db(db.checklist.event_id == event_id).update(content = content, name = request.json.get('name'))
    return dict()

@action('get_checklist', method="POST")
@action.uses(db, auth)
def get_checklist():
    event_id = request.json.get('event_id')
    checklist = db(db.checklist.event_id == event_id).select().first()
    name = checklist.name
    return dict(checklist = checklist.content, name = name)

@action('my_callback')
@action.uses() # Add here things like db, auth, etc.
def my_callback():
    # The return value should be a dictionary that will be sent as JSON.
    return dict(my_value=3)

@action('location/<path:path>',method=['POST','GET'])
@action('location',method=['POST','GET'])
@action.uses('location.html',db,auth,url_signer)
def location(path=None):
    return dict()

@action('sightings/<path:path>',method=['POST','GET'])
@action('sightings',method=['POST','GET'])
@action.uses('sightings.html',db,auth)
def sightings(path=None):
    return dict()

@action('species/<path:path>',method=['GET','POST'])
@action('species',method=['GET','POST'])
@action.uses('species.html',db,auth)
def species(path=None):
    return dict()

@action('stats/<path:path>',method=['GET','POST'])
@action('stats',method=['GET','POST'])
@action.uses('stats.html',db,auth)
def stats(path=None):
    return dict()