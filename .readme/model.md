## Data Models

These are the data types available in the API. All resources are found in the API by using the `uuid` (UUID v4) property added to each resource automatically.

### Annotation

The annotation model aims to eventually arrive at the official spec, but it still takes a few dirty shortcuts here and there.

```javascript
const annotation = {
  author: String,        // author's UUID
  created: String,       // ISO date string
  updated: String,       // ISO date string
  type: 'Annotation',    // default, duh...
  body: {
    type: String,        // type of the annotation (e.g. 'video/youtube'),
    purpose: String,     // see section about purposes below
    
    // now EITHER place an inline text body with
    value: String,
    
    // OR if you are annotating a remote resource
    source: String,      // URL of the annotation body source,
    
    // optionally, to select a fragment or position of the source
    selector: {
      type: String,      // selector type (e.g. 'Fragment')
      value: String      // selector expression (e.g. 't=1m40s&xywh=0,0,50,50')
    }
  },
  target: {
    id: String,          // URL (IRI) of the annotated resource
    type: String,        // type of the annotated resource
    
    selector: {          // optional
      type: String,      // selector type (e.g. 'Fragment')
      value: String      // selector expression (e.g. 't=1m40s&xywh=0,0,50,50')
    }
  }
}
```

#### Purpose/Motivation

Annotations can have different motivations, expressed as english natural language strings. Here are some examples:

- **linking** making a connection from a video to a timeline
- **commenting** adding a subjective opinion or position
- **replying** on a previous statement
- **describing** expressing the contents of an image through text
- **explaining** adding background information or context to something
- **tagging** connecting a resource to tags or taxonomy terms

## Map

A map is a [virtual uncharted territory](http://m.memegen.com/ik27zf.jpg) that represents a 1-n dimensional continuum.

The descriptors used to identify its various dimensional properties are used to choose appropriate selectors to connect annotations and resources to the continuum.

At present, maps have two modes of representation:

- **Timeline** representing continuous "natural real-time"
- **2DGrid** a continuous two dimensional plane to position things

```javascript
const map = {
  author: String,    // author's UUID
  title: String,
  type: [String],    // one or more types from above
}
```
