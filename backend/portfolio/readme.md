Portfolio
- consists of the following apis
1. /portfolio/users/{userId}  (GET)
    returns the total portfolio value of the user.
    eg:
    {
        stocks: {
            value: 1000
        },
        crypto: {
            value: 1000
        },
        cash: {
            value: 1000
        }
        total: 3000
    }
2. /portfolio/users/{userId}/stocks  (GET)
    returns the total stocks of the user
    eg:
    {
        "stocks": [
            {
                "tiger": {
                    apple: {
                        quantity: 100,
                        price: 100
                    }
            }, 
            {
                "moomoo" : {
                    "apple": {
                        "quantity": 100,
                        "price": 100
                    }
                }
            }]
        }
    }
3. /portfolio/users/{userId}/crypto  (GET)
    returns the total crypto value of the user
4. /portfolio/users/{userId}/cash  (GET)
    returns the total cash value of the user



