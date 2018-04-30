Write the facts on a plaintext format, they are parsed by custom rules (defined in [js/app.js](js/app.js#L59-L119)) and a state is generated. We use that final state to render the todomvc UI on the right.

![](screenshot.png)

Try it on https://journalstate-todomvc.alhur.es/

Currently this only works in Chrome because we're reusing the todomvc stylesheets and they define rules for `body`, thus we're putting the todomvc UI inside a shadow DOM, which is unsupported by Firefox yet.
