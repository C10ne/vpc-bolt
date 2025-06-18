# Page builder application

I want to build a page builder application where customers can select one of predefined templates  and edit them in a visual editor. It is aimed at broad audience, so there will be no need to edit technical properties, css styling or elements, component and sections will be predefined, and editable properties will be defined per component.

Page builder is a part of MojMeni.com, which aims to offer complete digital presence solution for hospitality industry (mainly establishments that use a menu - moj meni means my menu). At the moment we are offering a digital menu builder that can be accessed when a customer scans QR code on the table, and can go through full ordering process.

Editor should be very simple to use, without possibility to go deep into technical details, but give quick and simple controls for non technical audience to edit selected element. The template will be predefined and the sections, components and elements will have defined editable properties and restrictions.

### Layout:
- Top bar should give access to template styling properties (basic color scheme, font selection, branding options), selectors for responsive preview - mobile, tablet, desktop, which change the width of editor area to common widths for each type, preview options/buttons and a hamburger menu with items to connect to the rest of the platform, items will be decided later.
- Editor area is the main area, where page is previewed live, as changes are made. Users can select editable elements by clicking and get a bar with quick edit controls.
- Right sidebar will hold details about selected element and all editable options.

## Template components:

Basic building block is an Element, which mostly represent html elements with defined editable properties, but can be a bit more complicated to hold logically connected group of elements. When element is selected quick controls should appear floating next to it and editable properties and information should be displayed in right sidebar.
Example elements:
Simple:
Heading: <h> html tag, text should be editable in place, quick controls should offer selection of level - H!,H2,…
Paragraph: <p> html tag, containing vwyswyg editor for text editable in place
Image: <img> html tag with editable source, having the option to upload image or select it from media library
Group:
Form element with icon: contains wrapper element which will hold icon and textfield.
Text: element to write multiple paragraphs in a wysywig editor.


Each template will consist of a number of sections, each of which can hold one or more components. Number and type of components will be defined in section, so each section has predefined types of components that can be placed inside. For example, hero slider section can have only one  image slider component, video slider or hero image component, and user can change which one is used. Every component in section can be:
- freely editable and replaceable
- locked for replacing, so it can not be replaced
- locked for editing, so elements can’t be edited
  Example component types:
  Hero slider, image grid, article with image, text.
  Idea of section markup: <section name="hero” type="slider” />
  Pseudo section definition:
```javascript
  class SliderSection extends Section {
  componentTypes = [slider, mainImage, titleWithImage];
  componentNumber = 1;
  components: Component;
  construct (components: components) {
  this.components = components;
  }
  	render()	{
  		return(
  			<>
  				<section>
  					(components.foreach {
  						<component></component>
  					}
  				</section>
  			<>
  			);
  	}
  }`
```
Each component has one or more elements, which are basic html elements, or groups of elements. Components will have parameters that define element or other properties. Component elements are editable, but can’t be changed for different element (for example, user can upload new picture to replace default one and change image caption text, but cannot add more images or other text field). Component should have a list of components it can be swapped for, and that should be offered in quick actions when component is selected.
Example components:
Rich text, image with caption, product display, text with title.
Idea for component markup: <component type=“caption-image” image-class=“w-100” caption-class=“txt-lg” />
Pseudo component definition:
class CaptionImageComponent extends Component {

	}

Template should have global styling properties, like colour scheme, brand logo, title, subtitle, meta description. it should hold the default layout scheme, which consists of sections.

Key features:
* Users will be able to access more features as their level grows. Here is the level setting for the MVP:
*

Template properties and layout should be stored in database in a format suitable for easy editing.