Setting Up systemd Service for the Inspiration Backend
======================================================

The infrastructure of this site uses systemd to restart the backend if the
computer restarts.

Note that:

- In the [systemd unit file](./inspiration_backend.service), the
  `Restart=always` option makes sure the backend is always activated in the
  event of a system failure causing a system restart.

Thus, the website is protected from system-wide failures.

What to Edit in the Systemd Unit File
-------------------------------------

The systemd unit file at
[./inspiration_backend.service](./inspiration_backend.service)
is a template and needs some editing before being deployed.

- Line 6:

  ```
  WorkingDirectory=/path/to/inspiration_backend
  ```

  Change `/path/to/inspiration_backend` to the location of the root of the
  backend (where the file [index.js](../index.js) is located, so that the `node`
  command can read the correct files).

- Lines 7:

  ```
  ExecStart=/path/to/node /path/to/inspiration_backend/index.js
  ```

  Change `/path/to/node` to the location of the Node.js executable.
  To find this location, the command `which node` can be used.

  Also, change `/path/to/inspiration_backend` to the location of the root of the
  backend, as with the previous line.

Where to Put the Systemd Unit File
----------------------------------

For the operating system to be aware of the service, the unit file must be
placed in the `/etc/systemd/system/` directory.

Once the unit file is in this directory, use the command:

```
sudo systemctl daemon-reload
```

to reload systemd.

Managing the Service
--------------------

- To start the service, use the following command:

  ```
  sudo systemctl start inspiration_backend.service
  ```

- To enable the service, making it start whenever the computer is started
  or rebooted, use the following command:

  ```
  sudo systemctl enable inspiration_backend.service
  ```

- To check the status of the service, use the following command:

  ```
  sudo systemctl status inspiration_backend.service
  ```

- To view additional logs from the service, use the following command:

  ```
  journalctl -u inspiration_backend.service
  ```
