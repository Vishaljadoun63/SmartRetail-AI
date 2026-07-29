import pytest

@pytest.mark.anyio
async def test_read_root(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert "Welcome to Smart Retail API" in response.json()["message"]

@pytest.mark.anyio
async def test_admin_registration_and_login(client):
    # Register
    res = await client.post(
        "/api/v1/auth/register-admin",
        json={"email": "new@admin.com", "full_name": "New Admin", "password": "secure"}
    )
    assert res.status_code == 200
    assert res.json()["email"] == "new@admin.com"

    # Login
    res2 = await client.post(
        "/api/v1/auth/login",
        data={"username": "new@admin.com", "password": "secure"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert res2.status_code == 200
    assert "access_token" in res2.json()

@pytest.mark.anyio
async def test_get_analytics_unauthorized(client):
    res = await client.get("/api/v1/dashboard/analytics")
    assert res.status_code == 401

@pytest.mark.anyio
async def test_get_analytics_authorized(client, admin_token):
    res = await client.get(
        "/api/v1/dashboard/analytics",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert "summary" in res.json()
    assert "total_customers" in res.json()["summary"]

@pytest.mark.anyio
async def test_sentiment_analysis(client):
    # This calls the actual model if loaded, or fallback if not.
    res = await client.post(
        "/api/v1/ml/analyze-sentiment",
        json={"review_text": "I love this product!"}
    )
    assert res.status_code == 200
    assert "sentiment" in res.json()
    assert "confidence" in res.json()

@pytest.mark.anyio
async def test_chatbot(client):
    res = await client.post(
        "/api/v1/ml/chatbot",
        json={"message": "Hello"}
    )
    assert res.status_code == 200
    assert "reply" in res.json()
