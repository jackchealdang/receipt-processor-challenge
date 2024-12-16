### About the project

This is a project to process receipts. It's using Fastify as the backend, with a Python script to test the endpoints.

### How to run

1. Build image

```
docker build -t receipt-processor .
```

2. Run the container (server)
```
docker run -p 3000:3000 receipt-processor
```

3. Test the endpoints

#### Using Python

You can easily test the endpoints using the Python script I created.


```
python test.py

```

0 - Paste the receipt JSON here and you will receive a receipt ID if it's valid
1 - Use the receipt ID received from `0` and paste it here
2 - Exit

#### Using cURL

```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"retailer": "Target", "purchaseDate": "2022-01-02", "purchaseTime": "13:13", "total": "1.25", "items": [{ "shortDescription": "Pepsi - 12-oz", "price": "1.25" }]}' \
http://localhost:3000/receipts/process
```