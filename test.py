import os
import requests
import json

options = {
    0: "Process Receipt",
    1: "Calculate Points",
    2: "Exit"
}

while True:
    for key, val in options.items():
        print(f"{key} -- {val}")
    print()
    
    try:
        inp = int(input())
    except:
        print("\nPlease enter a valid NUMBER choice from the menu.\n")
        continue

    if inp == 0:
        print("\nInput Receipt JSON. Enter 0 to go back.\n")
        receipt = input()
        if receipt == "0":
            continue
        apiUrl = "http://localhost:3000/receipts/process"
        response = requests.post(apiUrl, json=json.loads(receipt))
        print()
        print(response.json())
        print()
    elif inp == 1:
        print("\nInput the Receipt ID of the Receipt you'd like to calculate. Enter 0 to go back.\n")
        receiptID = input()
        if receiptID == "0":
            continue
        apiUrl = f"http://localhost:3000/receipts/{receiptID}/points"
        response = requests.get(apiUrl)
        print()
        print(response.json())
        print()
    elif inp == 2:
        break
    else:
        print("\nPlease enter a valid selection from the menu.\n")