from yatl.helpers import INPUT

class GridActionButton:
 def __init__(
     self,
     url,
     text=None,
     icon=None,
     additional_classes="",
     additional_styles="",
     override_classes="",
     override_styles="",
     message="",
     append_id=False,
     name=None,
     ignore_attribute_plugin=False,
     **attrs
 ):
     self.url = url
     self.text = text
     self.icon = icon
     self.additional_classes = additional_classes
     self.additional_styles = additional_styles
     self.override_classes = override_classes
     self.override_styles = override_styles
     self.message = message
     self.append_id = append_id
     self.name = name
     self.ignore_attribute_plugin = ignore_attribute_plugin
     self.attrs = attrs

class GridTextInput:
    def __init__(self,
     url,
     value=None,
     text="enter me",
     icon=None,
     additional_classes="",
     additional_styles="",
     override_classes="",
     override_styles="",
     message="",
     append_id=False,
     name=None,
     ignore_attribute_plugin=False,
     **attrs):
     self.url = url
     self.value = value
     self.text = text
     self.icon = icon
     self.additional_classes = additional_classes
     self.additional_styles = additional_styles
     self.override_classes = override_classes
     self.override_styles = override_styles
     self.message = message
     self.append_id = append_id
     self.name = name
     self.ignore_attribute_plugin = ignore_attribute_plugin
     self.attrs = attrs

    def render(self):
        return INPUT(_name=self.name, _value=self.value, _class=self.additional_classes, _style=self.additional_styles, **self.attrs)
