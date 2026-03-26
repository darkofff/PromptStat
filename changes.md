# Przegląd projektu — lista zmian i propozycji

## 1. Bugi (do naprawienia)

### 1.1 Chaty istnieją tylko w pamięci przeglądarki
**Plik:** `client/src/api/chats.js`
Chaty są przechowywane w `Map` w JS — znikają po odświeżeniu strony. Modele `Chat` i `Exchange` istnieją w bazie, ale nie ma do nich endpointów. Trzeba dodać CRUD w `crud.py` + endpointy w `main.py` i podmienić `chats.js` na prawdziwe fetche.

### 1.2 Usuwanie projektu nie kaskaduje
**Plik:** `server/models.py`
Relacje w `Project` nie mają `cascade="all, delete-orphan"`. Usunięcie projektu zostawi osierocone datasety i chaty w bazie (albo rzuci błąd FK jeśli foreign keys są włączone). Naprawić:
```python
chats: Mapped[List["Chat"]] = relationship(back_populates="project", cascade="all, delete-orphan")
datasets: Mapped[List["Dataset"]] = relationship(back_populates="project", cascade="all, delete-orphan")
```
To samo w `Chat` dla `exchanges`.

### 1.3 SQLite nie wymusza foreign keys domyślnie
**Plik:** `server/database.py`
SQLite wymaga `PRAGMA foreign_keys = ON`, inaczej FK constraints są ignorowane. Dodać event listener:
```python
from sqlalchemy import event

@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
```

### 1.4 Przycisk "Remove" w Dataset nie usuwa danych z backendu
**Plik:** `client/src/pages/Dataset.jsx`
`handleRemoveCsv` czyści tylko UI (file input). Brakuje endpointu `DELETE /datasets/{id}` i wywołania go z frontendu.

### 1.5 Kolizja slugów — dwa projekty o tym samym tytule
**Pliki:** `client/src/utils/slugify.js`, `App.jsx`
Routing używa slugowanego tytułu (`/project/sales-forecasting`). Jeśli dwa projekty mają ten sam tytuł, slug będzie identyczny i nawigacja się zepsuje. Rozwiązanie: zmienić routing na ID (`/project/:projectId`) albo na `id-slug` (`/project/2-sales-forecasting`).

### 1.6 Brak obsługi błędów przy dekodowaniu CSV
**Plik:** `server/main.py`, linia 110
`(await file.read()).decode()` rzuci wyjątek jeśli plik nie jest UTF-8. Dodać obsługę:
```python
try:
    content = (await file.read()).decode("utf-8")
except UnicodeDecodeError:
    raise HTTPException(status_code=400, detail="File is not valid UTF-8")
```

---

## 2. Brakująca funkcjonalność

### 2.1 Brak endpointów dla Chat i Exchange
**Pliki:** `server/main.py`, `server/crud.py`
Modele istnieją w `models.py`, ale nie ma endpointów. Potrzebne minimum:
- `POST /projects/{project_id}/chats` — nowy chat
- `GET /projects/{project_id}/chats` — lista chatów
- `POST /chats/{chat_id}/exchanges` — nowa wymiana (prompt + response)
- `GET /chats/{chat_id}/exchanges` — historia chatu

Oraz schematy w `schemas.py` (ChatBase, ChatRead, ExchangeBase, ExchangeRead).

### 2.2 LLM nie ma dostępu do datasetu
**Plik:** `server/main.py` — endpoint `/ask`
Endpoint `/ask` jest oderwany od reszty — nie wie o projekcie, chacie ani datasecie. To jest kluczowa funkcjonalność aplikacji. Docelowo prompt do LLM powinien zawierać kontekst datasetu, np.:
```
POST /projects/{project_id}/chats/{chat_id}/ask
```
Endpoint pobiera dataset projektu, wstrzykuje go do promptu i wysyła do LLM.

### 2.3 Brak usuwania/edycji datasetu
**Pliki:** `server/main.py`, `server/crud.py`
Brakuje `DELETE /datasets/{id}` — potrzebny żeby przycisk "Remove" w UI działał.

### 2.4 Brak usuwania/edycji projektów na frontendzie
**Plik:** `client/src/pages/Projects.jsx`, `client/src/api/projects.js`
Backend ma `PATCH` i `DELETE` dla projektów, ale frontend tego nie używa — nie ma przycisków do edycji ani usuwania.

---

## 3. Architektura i refactoring

### 3.1 Hardcoded API URL
**Pliki:** `client/src/api/projects.js`, `datasets.js`, `prompts.js`
`http://localhost:8000` jest zahardcodowany w każdym pliku. Wyciągnąć do jednego miejsca:
```js
// client/src/api/config.js
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

### 3.2 AskRequest powinien być w schemas.py
**Plik:** `server/main.py`, linia 54
`AskRequest` to schemat Pydantic zdefiniowany w `main.py`. Przenieść do `schemas.py` razem z resztą schematów.

### 3.3 LLM tworzy nową instancję na każdy request
**Plik:** `server/main.py`, linia 60
`ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")` jest tworzony w ciele funkcji przy każdym wywołaniu. Lepiej stworzyć raz na poziomie modułu:
```python
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
```

### 3.4 Martwy kod: `handle_csv.js`
**Plik:** `client/src/utils/handle_csv.js`
`parseCsv` nie jest już nigdzie importowany — parsowanie przeniesione na backend. Plik do usunięcia.

### 3.5 Zustand zainstalowany, nieużywany
**Plik:** `client/package.json`
`zustand` jest w zależnościach, ale nigdzie nie jest importowany. Usunąć albo zacząć używać (np. do globalnego stanu wybranego projektu).

### 3.6 Nieużywane importy w main.py
**Plik:** `server/main.py`
- `engine` z `database` — nigdzie nie używany w endpointach (używany w lifespan, ale importowany jest `Base`)
- `BaseModel` z `pydantic` — po przeniesieniu `AskRequest` do schemas.py nie będzie potrzebny

### 3.7 Mieszanie async i sync endpointów
**Plik:** `server/main.py`
`add_dataset` jest `async def` (bo używa `await file.read()`), reszta to `def`. To jest OK technicznie, ale warto to wiedzieć — jeśli w przyszłości będzie więcej async operacji, rozważyć przejście na async SQLAlchemy.

---

## 4. Bezpieczeństwo

### 4.1 Brak limitu rozmiaru pliku
**Plik:** `server/main.py`
Upload CSV nie ma żadnego limitu. Ktoś może wysłać plik 1GB i zabić serwer. Dodać walidację:
```python
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
content = await file.read()
if len(content) > MAX_FILE_SIZE:
    raise HTTPException(status_code=413, detail="File too large (max 10MB)")
```

### 4.2 Brak walidacji typu pliku po stronie serwera
**Plik:** `server/main.py`
Frontend ogranicza do `.csv` (atrybut `accept`), ale serwer przyjmie cokolwiek. Dodać sprawdzenie:
```python
if not file.filename.endswith(".csv"):
    raise HTTPException(status_code=400, detail="Only CSV files are accepted")
```

### 4.3 Brak autentykacji
Cały API jest otwarty. Na razie OK na localhost, ale przed deployem trzeba dodać auth (np. JWT, OAuth).

---

## 5. Propozycje ulepszeń

### 5.1 Routing po ID zamiast slug
Zmienić URL z `/project/:projectName` na `/project/:projectId`. Eliminuje problem kolizji slugów, upraszcza lookup projektu na frontendzie (nie trzeba fetchować wszystkich projektów żeby znaleźć ID), i jest standardem w REST API.

### 5.2 Osobny schemat do listowania datasetów (bez pola data)
`GET /projects/{id}/datasets` zwraca pełne dane CSV w polu `data` dla każdego datasetu. Przy dużych plikach to ogromny payload. Stworzyć `DatasetListItem` bez pola `data`, a pełne dane zwracać przez `GET /datasets/{id}`.

### 5.3 Endpoint `/ask` powiązany z projektem
Zamiast generycznego `/ask`, stworzyć `POST /projects/{id}/chats/{chat_id}/ask` który:
1. Pobiera dataset projektu
2. Buduje prompt z kontekstem danych
3. Wysyła do LLM
4. Zapisuje exchange w bazie

To jest serce aplikacji — warto zaplanować tę logikę dobrze.

### 5.4 Error boundaries w React
Dodać React Error Boundary component żeby błędy w jednym komponencie nie crashowały całej aplikacji.
