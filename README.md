# Iceover App

This is a small convenience app for getting push notifications of new events at
the ice rink at The Crossover in Cedar Park, TX.

### Usage

Deno Fresh Make sure to install Deno:
https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

### Web Push

Generate the VAPID keys:

```
# You can use any Web compatible runtime.
$ deno run https://raw.githubusercontent.com/negrel/webpush/master/cmd/generate-vapid-keys.ts
```
