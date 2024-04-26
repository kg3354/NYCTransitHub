from pymongo import MongoClient
import bcrypt

def add_toDb(CONNECTION_STRING,id, password):
    try:
        # Provide the MongoDB Atlas URL to connect Python to MongoDB using pymongo
       
        
        # Create a connection using MongoClient.
        client = MongoClient(CONNECTION_STRING)
        
        # database and collection code goes here
        


        # Prepare the password and hash it
        password = b'adminPassword'
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password, salt)
        
        # Prepare the data item
        item = {
            "id": "admin",
            "password": hashed
        }
        
        # Access the collection and insert the item
        db = client["Cluster0"]["ACL"]
        result = db.insert_one(item)
        print("Data added successfully. Document ID:", result.inserted_id)
        
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    CONNECTION_STRING = "mongodb+srv://testuser:testuser123@cluster0.irugazx.mongodb.net/"
    id = "admin"
    password = "adminPassword"
    add_toDb(CONNECTION_STRING,id, password)
