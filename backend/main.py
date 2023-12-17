#Pantaree Wechsathol -103837447
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
from pydantic import BaseModel
from solcx import compile_standard, install_solc
from dotenv import load_dotenv
import os
import json
import mysql.connector
import time, datetime

# App object
app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#load env var from .env
load_dotenv()
# database
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PWD"),
    "database": os.getenv("DB"),
}

# connect to db
while True:
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor(dictionary=True)
        print("Database connection was successful")
        break
    except Exception:
        print("Connection to database failed")
        time.sleep(5)
# read contract file
with open("./Trade.sol", "r") as file:
    trade_file = file.read()

# solcx
install_solc("0.8.0")
compile_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"Trade.sol": {"content": trade_file}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.8.0",
)

# compiled contract
with open("compiled_code.json", "w") as file:
    json.dump(compile_sol, file)

#get bytecode
bytecode = compile_sol["contracts"]["Trade.sol"]["Trade"]["evm"][
    "bytecode"
]["object"]

#get abi
abi = compile_sol["contracts"]["Trade.sol"]["Trade"]["abi"]

# connect to Ganache
w3 = Web3(Web3.HTTPProvider(os.getenv("WEB3_SERVER")))
chain_id = int(os.getenv("CHAIN_ID"))
my_address = os.getenv("MY_ADDRESS")
private_key = os.getenv("PRIVATE_KEY")
contract_addresses = []

#add transaction
@app.post("/transaction", status_code=status.HTTP_201_CREATED)
async def add_transaction():
    #create contract in python
    Trade = w3.eth.contract(abi=abi, bytecode=bytecode)
    #get latest transaction id
    nonce = w3.eth.get_transaction_count(my_address)
    #construct transaction
    transaction = Trade.constructor().build_transaction(
            {
            "chainId": chain_id,
            "from": my_address,
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce
            }
        )
    #sign transaction
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    #send transaction
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    #wait for transaction receipt    
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    #call function in contract
    trade = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

    #get block
    block_no = w3.eth.block_number
    block = w3.eth.get_block(block_no, full_transactions=True)
    timestamp = block.timestamp
    txn_date = datetime.datetime.utcfromtimestamp(timestamp).isoformat().replace("T", " ")
    #get latest transaction id
    nonce = w3.eth.get_transaction_count(my_address)
    store_transaction = trade.functions.storeTransaction(tx_receipt["blockNumber"], tx_receipt["from"], tx_receipt["contractAddress"],tx_receipt["transactionHash"].hex(), txn_date,tx_receipt["status"]).build_transaction(
        {
            "chainId": chain_id,
            "gasPrice": w3.eth.gas_price,
            "from": my_address,
            "nonce": nonce
        }
    )
    signed_store_txn = w3.eth.account.sign_transaction(store_transaction, private_key=private_key)
    send_store_tx = w3.eth.send_raw_transaction(signed_store_txn.rawTransaction)
    w3.eth.wait_for_transaction_receipt(send_store_tx)
    contract_addresses.append(tx_receipt.contractAddress)
    return tx_receipt.contractAddress
    

# get all available assets
@app.get("/assets")
async def get_assets():
    cursor.execute("SELECT * FROM assets")
    assets = cursor.fetchall()
    return assets


# get individual asset using asset id
@app.get("/assets/{asset_id}")
async def get_asset_by_id(asset_id: int):
    cursor.execute("SELECT * FROM assets WHERE id = %s ", (asset_id,))
    asset = cursor.fetchone()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset {asset_id} was not found",
        )
    return asset


# view cart
@app.get("/cart")
async def get_cart():
    cursor.execute(
        """
        SELECT cart.asset_id, assets.name, assets.eth, assets.aud, assets.img, cart.userid 
        FROM cart 
        INNER JOIN assets ON cart.asset_id = assets.id
    """
    )
    cart = cursor.fetchall()

    return cart


# add an asset to cart
@app.post("/cart", status_code=status.HTTP_201_CREATED)
async def add_asset(asset_id: int, userid:int):
    # insert value from assets table into cart table
    cursor.execute(
        """
        INSERT INTO cart (cart_id,asset_id,userid) 
        VALUES (1, %s, %s ) 
    """,
        (asset_id, userid, ),
    )
    db.commit()
    return {"message": "An asset is added to the cart!"}


# remove cartItem
@app.delete("/cart/{asset_id}")
async def remove_asset(asset_id: int, userid:int):
    cursor.execute("DELETE FROM cart WHERE asset_id = %s && userid = %s", (asset_id,userid))
    db.commit()
    return {"message": "An asset is removed from the cart!"}

#clear cart
@app.delete("/cart")
async def clear_cart(userid:int):
    cursor.execute("DELETE FROM cart WHERE userid = %s ", (userid,))
    db.commit()
    return {"message": "The cart is cleared!"}

#get transaction
@app.get("/transactions")
async def get_transactions():

    if not contract_addresses:
        raise HTTPException(status_code=404, detail="No contract addresses are found")
    
    txn_dict=[]

    for contract_address in contract_addresses:
        contract = w3.eth.contract(address=contract_address, abi=abi)
        transactions = contract.functions.getTransactions().call()
        for tx in transactions:
            tx_dict = {
                "block": tx[0],
                "from": tx[1],
                "to": tx[2],
                "hash": tx[3],
                "date": tx[4],
                "status": tx[5],
            }
            txn_dict.append(tx_dict)

    if not txn_dict:
        raise HTTPException(status_code=404, detail="No transactions found")

    return txn_dict

#add assets from cart table to purchasedAssets table
@app.post("/purchasedAssets", status_code=status.HTTP_201_CREATED)
async def add_purchasedAsset(data: list[dict[str,int]]):
    for item in data:
        userid = item["userId"]
        asset_id = item["assetId"]
    # insert value from cart table into purchasedAssets table
        cursor.execute(
            """
            INSERT INTO purchased_assets (userid, asset_id) 
            VALUES (%s, %s)
        """,
            (userid, asset_id,),
        )
    db.commit()
    return {"message": "Successfully store assets into the purchased_assets table!"}

#get purchased assets
@app.get("/purchasedAssets/{userid}")
async def get_purchasedAsset(userid:int):
    cursor.execute(
        """
        SELECT asset_id, a.name, a.eth, a.img
        FROM purchased_assets p INNER JOIN assets a on p.asset_id = a.id WHERE userid = %s
    """, (userid,)
    )
    purchasedAsset = cursor.fetchall()
    if not purchasedAsset:
        raise HTTPException(status_code=404, detail="No purchased assets are found for this user")
    return purchasedAsset

#user

class User(BaseModel):
    id:int
    name:str
    username:str    
    password:str
    pic:str

# check if valid username
def get_user(username:str):
    cursor.execute(
        """
        SELECT *
        FROM users 
        WHERE username = %s
    """, (username,)
    )
    user_data = cursor.fetchone()
    if user_data:
        return User(id=user_data["user_id"],name=user_data["display_name"],username=user_data["username"], password=user_data["password"], pic=user_data["profilepic"])
    else:
        return None

#get user
@app.get("/users/{username}")
async def authenticate_user(username:str, password:str):
    user = get_user(username)
    if user and user.password == password:
        return user
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    