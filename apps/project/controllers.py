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
from .helpers import GridActionButton, GridTextInput

url_signer = URLSigner(session)


@action('index')
@action.uses('index.html', db, auth, url_signer)
def index():
    return dict(
        # COMPLETE: return here any signed URLs you need.
        my_callback_url = URL('my_callback', signer=url_signer),
    )

@action('my_callback')
@action.uses() # Add here things like db, auth, etc.
def my_callback():
    # The return value should be a dictionary that will be sent as JSON.
    return dict(my_value=3)

@action('checklist/<path:path>', method=['POST', 'GET'])  
@action('checklist', method=['POST', 'GET'])
@action.uses('checklist.html', db, auth)
def checklist(path = None):
    pre_action_buttons = [
        lambda row: GridActionButton(
            URL("checklist_increment", row.id),
            text="test"
        )
    ]
    post_action_buttons = [
        lambda row: GridActionButton(
            URL("checklist_increment", row.id),
            text= "Increment",
            icon="fa-plus",
            value=0,
        )
    ]
    grid = Grid(path,
                formstyle= FormStyleBulma,
                grid_class_style=GridClassStyleBulma,
                query = (db.species.id > 0),
                search_queries=[['Search by Species', lambda val: db.species.name.contains(val)]],
                create=False,
                details=False,
                editable=False,
                deletable=False,
                # pre_action_buttons=pre_action_buttons,
                post_action_buttons=post_action_buttons,
                )
    return dict(grid=grid)

@action('checklist_increment', method=['POST'])
def checklist_increment():
    id = request.json.get('id')
    return dict(id=id)
    # row = db(db.species.id == id).select().first()
    # if row:
    #     row.update_record(count=row.count+1)
    # return dict(count=row.count)

@action('location/<path:path>',method=['POST','GET'])
@action('location',method=['POST','GET'])
@action.uses('location.html',db,auth)
def location(path=None):
    return dict()