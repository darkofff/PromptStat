from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Server is running"}


def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["message"] == "pong"


if __name__ == "__main__":
    test_root()
    print("✓ GET / returned expected response")
    test_ping()
    print("✓ GET /ping returned expected response")
    print("All tests passed!")


