# Music

A music player written in electron

## Errors

The following error may occur:

```sh
Error: Cannot find module '/path/to/project/node_modules/sqlite3/lib/binding/electron-v7.1-linux-x64/node_sqlite3.node'
```

If so run the following command:

```sh
./node_modules/.bin/electron-rebuild -w sqlite3 -p
```

Wait some time and sqlite3 will be rebuilt.
