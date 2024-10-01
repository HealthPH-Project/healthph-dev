# HealthPH (v2.1)

## Prerequisites
1. Python
2. MongoDB database connection string

### How to setup
1. In client folder, create an `.env` file and copy the contents of `.env.example` file. Put the required data.
2. In server, create an `.env` file and copy the contents of `.env.example` file. Put the required data.
3. Open terminal on root directory, and go to `client` directory

```bash
cd client
```
4. Type the following commands:
```bash
yarn install
yarn build
```

5. Open another terminal in root directory, and go to `server` folder
```bash
cd server
```

6. Type the following commands:
```
python -m venv ./.venv

.venv/Scripts/activate

pip install -r requirements.txt
```

### How to use
1. Open terminal in root directory and go to `server` folder.
```bash
cd server
```
2. Run FastAPI app.
```bash
python main.py
```
3. On a browser go to the following URL: `http://localhost:8000/`