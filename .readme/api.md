# API Documentation
## Members

<dl>
<dt><a href="#buildVars">buildVars</a></dt>
<dd><p>Build Variables (see: src/buildVars.js)</p></dd>
<dt><a href="#resources">resources</a></dt>
<dd><p><p>Services: Resources (mounted as endpoints)</p></p>
<ul>
<li>resources/annotations -&gt; /annotations</li>
<li>resources/maps        -&gt; /maps</li>
</ul></dd>
<dt><a href="#middleware">middleware</a></dt>
<dd><p>Custom Middleware (Optional entry points)</p></dd>
</dl>

## Constants

<dl>
<dt><a href="#app">app</a></dt>
<dd><p>libmb-feathers-api v1.0.0</p>
<p>Initialize abstract API server with
custom configuration</p>
<p>See config/default.json &amp; production.json
for general config variables</p></dd>
</dl>

<a name="buildVars"></a>

## buildVars
<p>Build Variables (see: src/buildVars.js)</p>

**Kind**: global variable  

* * *

<a name="resources"></a>

## resources
<p>Services: Resources (mounted as endpoints)</p>
<ul>
<li>resources/annotations -&gt; /annotations</li>
<li>resources/maps        -&gt; /maps</li>
</ul>

**Kind**: global variable  

* * *

<a name="middleware"></a>

## middleware
<p>Custom Middleware (Optional entry points)</p>

**Kind**: global variable  

* [middleware](#middleware)
    * [.preAuth](#middleware.preAuth)
    * [.postAuth](#middleware.postAuth)
    * [.postResource](#middleware.postResource)


* * *

<a name="middleware.preAuth"></a>

### middleware.preAuth
<p>Pre auth middleware (optional)</p>

**Kind**: static property of [<code>middleware</code>](#middleware)  

* * *

<a name="middleware.postAuth"></a>

### middleware.postAuth
<p>Post auth middleware (optional)</p>

**Kind**: static property of [<code>middleware</code>](#middleware)  

* * *

<a name="middleware.postResource"></a>

### middleware.postResource
<p>Post resource middleware (optional)</p>

**Kind**: static property of [<code>middleware</code>](#middleware)  

* * *

<a name="app"></a>

## app
<p>libmb-feathers-api v1.0.0</p>
<p>Initialize abstract API server with
custom configuration</p>
<p>See config/default.json &amp; production.json
for general config variables</p>

**Kind**: global constant  

* * *

