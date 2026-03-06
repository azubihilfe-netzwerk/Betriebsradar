# Betriebsradar



## How to start the backend locally?

Install:

```
cd backend
npm install
```

Create sample data (The script is idempotent, you can run it at any time to create some data. All data is stored keystone.db )
```
npm run seed_data
```

run backend in dev mode:
```
npm run dev
```

Access the keystone admin UI under [http://localhost:3000](http://localhost:3000), login as admin@example.com` (PW: `test1234`). The user is created by the `seed_data` script.




