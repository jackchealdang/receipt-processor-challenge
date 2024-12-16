## About the project

This is a project to process receipts. It's using Fastify as the backend, with a Python script to test the endpoints.

## How to run

1. Build image

```
docker build -t receipt-processor .
```

2. Run the container (server)
```
docker run -p 3000:3000 receipt-processor
```

## Test the endpoints

### Using Python

You can easily test the endpoints using the Python script I created.


```
python test.py
```

**0 - Paste the receipt JSON here and you will receive a receipt ID if it's valid  
1 - Use the receipt ID received from `0` and paste it here  
2 - Exits the test suite**  
  
  
0 - Paste the receipt JSON here and you will receive a receipt ID if it's valid  

#### Example JSON receipt input (paste as one line)

```
{
    "retailer": "Walgreens",
    "purchaseDate": "2022-01-02",
    "purchaseTime": "08:13",
    "total": "2.65",
    "items": [
        {"shortDescription": "Pepsi - 12-oz", "price": "1.25"},
        {"shortDescription": "Dasani", "price": "1.40"}
    ]
}
```

#### Example receipt ID output
```
{'id': '30fb79f5-33be-450d-8805-eb53e9e6e9d6'}
```

1 - Use the receipt ID received from `0` and paste it here

#### Example receipt ID input
```
30fb79f5-33be-450d-8805-eb53e9e6e9d6
```

#### Example receipt points output
```
{'points': 25}
```

2 - Exits the test suite

### Using cURL

#### Test /receipts/process

```
curl --header "Content-Type: application/json" \
--request POST \
--data '{ "retailer": "Walgreens", "purchaseDate": "2022-01-02", "purchaseTime": "08:13", "total": "2.65", "items": [ {"shortDescription": "Pepsi - 12-oz", "price": "1.25"}, {"shortDescription": "Dasani", "price": "1.40"} ] }' \
http://localhost:3000/receipts/process
```

#### Test /receipts/{id}/points

```
curl http://localhost:3000/receipts/30fb79f5-33be-450d-8805-eb53e9e6e9d6/process
```