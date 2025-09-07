from langchain.agents import create_react_agent, AgentExecutor
from langchain_tavily import TavilySearch
from langchain_mongodb.agent_toolkit import MongoDBDatabase, MongoDBDatabaseToolkit
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain.tools import Tool
import json

import os
from dotenv import load_dotenv

load_dotenv(".env")

# Initialize components
search_tool = TavilySearch(max_results=1)
db = MongoDBDatabase.from_connection_string(
    os.environ.get("MONGODB_URI", None), database="graidea"
)

# Debug: Print database object attributes
print("MongoDBDatabase object attributes:")
print(f"  Type: {type(db)}")
print(f"  Dir: {[attr for attr in dir(db) if not attr.startswith('_')]}")
if hasattr(db, 'database_name'):
    print(f"  database_name: {db.database_name}")
if hasattr(db, '_client'):
    print(f"  _client: {type(db._client)}")

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.2)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
db_tools = MongoDBDatabaseToolkit(llm=llm, db=db).get_tools()

# Initialize in-memory vector store
vector_store = None


def load_reviews_to_vector_store():
    """Load reviews from MongoDB into the vector store"""
    global vector_store

    print("Loading reviews from MongoDB into vector store...")

    try:
        # Try different query formats to find reviews
        reviews = []
        
        # Method 1: Direct MongoDB query
        try:
            reviews_query = {"collection": "reviews", "query": {}}
            reviews_result = db.run(reviews_query)
            if reviews_result and reviews_result.get("result"):
                reviews = reviews_result["result"]
                print(f"Found {len(reviews)} reviews using direct query")
        except Exception as e:
            print(f"Direct query failed: {e}")
        
        # Method 2: Try using MongoDB tools directly
        if not reviews:
            try:
                # Use the MongoDB query tool directly
                from langchain_mongodb.agent_toolkit.tool import MongoDBQueryTool
                query_tool = MongoDBQueryTool(db=db)
                result = query_tool.run({"collection": "reviews", "query": {}})
                if result:
                    reviews = json.loads(result) if isinstance(result, str) else result
                    print(f"Found {len(reviews)} reviews using MongoDB tool")
            except Exception as e:
                print(f"MongoDB tool query failed: {e}")
        
        # Method 3: Try raw PyMongo connection
        if not reviews:
            try:
                # Access the raw MongoDB client and database
                client = db._client
                db_name = db.database_name
                raw_db = client[db_name]
                reviews_cursor = raw_db.reviews.find({})
                reviews = list(reviews_cursor)
                print(f"Found {len(reviews)} reviews using raw PyMongo")
            except Exception as e:
                print(f"Raw PyMongo query failed: {e}")
                # Try alternative method
                try:
                    # Get database name from the MongoDBDatabase object
                    db_name = getattr(db, 'database_name', 'graidea')
                    client = getattr(db, '_client', None)
                    if client:
                        raw_db = client[db_name]
                        reviews_cursor = raw_db.reviews.find({})
                        reviews = list(reviews_cursor)
                        print(f"Found {len(reviews)} reviews using alternative PyMongo method")
                except Exception as e2:
                    print(f"Alternative PyMongo query also failed: {e2}")

        if not reviews:
            print("No reviews found in the database using any method")
            return

        print(f"Successfully loaded {len(reviews)} reviews")
        
        # Log the first few reviews to debug
        print("\n" + "="*50)
        print("DEBUG: Sample of fetched reviews:")
        print("="*50)
        for i, review in enumerate(reviews[:3]):  # Show first 3 reviews
            print(f"Review {i+1}:")
            print(f"  Type: {type(review)}")
            print(f"  Content: {review}")
            print(f"  Keys: {list(review.keys()) if isinstance(review, dict) else 'Not a dict'}")
            print("-" * 30)
        
        if len(reviews) > 3:
            print(f"... and {len(reviews) - 3} more reviews")
        print("="*50)

        # Convert reviews to documents
        documents = []
        print("\nConverting reviews to documents...")
        
        for i, review in enumerate(reviews):
            try:
                # Create a text representation of the review
                text = f"Student: {review.get('studentName', 'Unknown')} | "
                text += f"Teacher: {review.get('teacherName', 'Unknown')} | "
                text += f"Rating: {review.get('rating', 'N/A')} | "
                text += f"Review: {review.get('review', 'No review text')}"

                doc = Document(
                    page_content=text,
                    metadata={
                        "studentId": review.get("studentId"),
                        "teacherId": review.get("teacherId"),
                        "studentName": review.get("studentName"),
                        "teacherName": review.get("teacherName"),
                        "rating": review.get("rating"),
                        "review": review.get("review"),
                    },
                )
                documents.append(doc)
                
                # Log first few document conversions
                if i < 2:
                    print(f"Document {i+1} created:")
                    print(f"  Text: {text[:100]}...")
                    print(f"  Metadata: {doc.metadata}")
                    print("-" * 20)
                    
            except Exception as e:
                print(f"Error converting review {i+1}: {e}")
                print(f"Problematic review: {review}")
                continue

        # Create vector store
        print(f"\nCreating vector store with {len(documents)} documents...")
        if documents:
            try:
                print("Generating embeddings...")
                vector_store = FAISS.from_documents(documents, embeddings)
                print(f"✓ Vector store created successfully with {len(documents)} documents")
                print(f"✓ Vector store dimensions: {getattr(vector_store, 'd', 'Unknown')}")
                print(f"✓ Vector store total documents: {getattr(vector_store, 'ntotal', len(documents))}")
            except Exception as e:
                print(f"✗ Error creating vector store: {e}")
                print("This might be due to embedding generation issues")
        else:
            print("✗ No documents to add to vector store")

    except Exception as e:
        print(f"Error loading reviews: {e}")


def search_reviews_tool(query: str) -> str:
    """Search for reviews using vector similarity"""
    if vector_store is None:
        return "Vector store not initialized. Please load reviews first."

    try:
        # Search for similar documents
        docs = vector_store.similarity_search(query, k=5)

        if not docs:
            return "No relevant reviews found."

        results = []
        for doc in docs:
            results.append(
                {
                    "student": doc.metadata.get("studentName", "Unknown"),
                    "teacher": doc.metadata.get("teacherName", "Unknown"),
                    "rating": doc.metadata.get("rating", "N/A"),
                    "review": doc.metadata.get("review", "No review text"),
                    "content": doc.page_content,
                }
            )

        return json.dumps(results, indent=2)

    except Exception as e:
        return f"Error searching reviews: {e}"


def get_teacher_reviews_tool(teacher_id: str) -> str:
    """Get all reviews for a specific teacher by teacherId"""
    try:
        reviews = []
        
        # Method 1: Direct MongoDB query
        try:
            teacher_query = {
                "collection": "reviews",
                "query": {"teacherId": int(teacher_id)},
            }
            reviews_result = db.run(teacher_query)
            if reviews_result and reviews_result.get("result"):
                reviews = reviews_result["result"]
        except Exception as e:
            print(f"Direct teacher query failed: {e}")
        
        # Method 2: Try raw PyMongo connection
        if not reviews:
            try:
                client = db._client
                db_name = db.database_name
                raw_db = client[db_name]
                reviews_cursor = raw_db.reviews.find({"teacherId": int(teacher_id)})
                reviews = list(reviews_cursor)
            except Exception as e:
                print(f"Raw PyMongo teacher query failed: {e}")
                # Try alternative method
                try:
                    db_name = getattr(db, 'database_name', 'graidea')
                    client = getattr(db, '_client', None)
                    if client:
                        raw_db = client[db_name]
                        reviews_cursor = raw_db.reviews.find({"teacherId": int(teacher_id)})
                        reviews = list(reviews_cursor)
                except Exception as e2:
                    print(f"Alternative PyMongo teacher query also failed: {e2}")

        if not reviews:
            return f"No reviews found for teacher with ID: {teacher_id}"

        # Calculate statistics
        ratings = [
            review.get("rating", 0)
            for review in reviews
            if review.get("rating") is not None
        ]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0

        # Format results
        results = {
            "teacher_id": teacher_id,
            "total_reviews": len(reviews),
            "average_rating": round(avg_rating, 2),
            "teacher_name": reviews[0].get("teacherName", "Unknown")
            if reviews
            else "Unknown",
            "reviews": [],
        }

        for review in reviews:
            results["reviews"].append(
                {
                    "student": review.get("studentName", "Unknown"),
                    "rating": review.get("rating", "N/A"),
                    "review": review.get("review", "No review text"),
                    "student_id": review.get("studentId", "N/A"),
                }
            )

        return json.dumps(results, indent=2)

    except ValueError:
        return f"Invalid teacher ID: {teacher_id}. Please provide a valid number."
    except Exception as e:
        return f"Error fetching teacher reviews: {e}"


def get_recommendations_tool(query: str) -> str:
    """Get recommendations based on user query using vector similarity and analysis"""
    if vector_store is None:
        return "Vector store not initialized. Please load reviews first."

    try:
        # Search for similar documents
        docs = vector_store.similarity_search(query, k=10)

        if not docs:
            return "No relevant reviews found for recommendations."

        # Analyze the reviews to provide recommendations
        teacher_stats = {}
        common_themes = []

        for doc in docs:
            teacher_name = doc.metadata.get("teacherName", "Unknown")
            rating = doc.metadata.get("rating", 0)
            review_text = doc.metadata.get("review", "").lower()

            if teacher_name not in teacher_stats:
                teacher_stats[teacher_name] = {
                    "ratings": [],
                    "reviews": [],
                    "teacher_id": doc.metadata.get("teacherId", "N/A"),
                }

            teacher_stats[teacher_name]["ratings"].append(rating)
            teacher_stats[teacher_name]["reviews"].append(review_text)

        # Calculate recommendations
        recommendations = []

        for teacher, stats in teacher_stats.items():
            if stats["ratings"]:
                avg_rating = sum(stats["ratings"]) / len(stats["ratings"])
                review_count = len(stats["ratings"])

                # Analyze common themes in reviews
                all_reviews = " ".join(stats["reviews"])
                themes = []

                # Check for common positive themes
                positive_themes = [
                    "excellent",
                    "great",
                    "amazing",
                    "wonderful",
                    "helpful",
                    "clear",
                    "engaging",
                    "knowledgeable",
                ]
                negative_themes = [
                    "difficult",
                    "hard",
                    "confusing",
                    "boring",
                    "unclear",
                    "unhelpful",
                ]

                pos_count = sum(1 for theme in positive_themes if theme in all_reviews)
                neg_count = sum(1 for theme in negative_themes if theme in all_reviews)

                recommendations.append(
                    {
                        "teacher_name": teacher,
                        "teacher_id": stats["teacher_id"],
                        "average_rating": round(avg_rating, 2),
                        "review_count": review_count,
                        "positive_themes": pos_count,
                        "negative_themes": neg_count,
                        "recommendation_score": round(
                            avg_rating + (pos_count - neg_count) * 0.1, 2
                        ),
                    }
                )

        # Sort by recommendation score
        recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)

        # Generate summary
        result = {
            "query": query,
            "total_reviews_analyzed": len(docs),
            "recommendations": recommendations[:5],  # Top 5 recommendations
            "summary": f"Based on {len(docs)} reviews, here are the top recommendations for your query: '{query}'",
        }

        return json.dumps(result, indent=2)

    except Exception as e:
        return f"Error generating recommendations: {e}"


# Create the tools
vector_search_tool = Tool(
    name="search_reviews",
    description="Search for teacher reviews using vector similarity. Use this to find relevant reviews based on the user's query.",
    func=search_reviews_tool,
)

teacher_reviews_tool = Tool(
    name="get_teacher_reviews",
    description="Get all reviews for a specific teacher by their teacherId. Use this when you need to see all reviews for a particular teacher.",
    func=get_teacher_reviews_tool,
)

recommendations_tool = Tool(
    name="get_recommendations",
    description="Get recommendations based on user query. This analyzes reviews to provide teacher recommendations with scores and themes.",
    func=get_recommendations_tool,
)

# Test database connection and collections
def test_database_connection():
    """Test database connection and list available collections"""
    try:
        print("Testing database connection...")
        print(f"Database name: {getattr(db, 'database_name', 'graidea')}")
        print(f"MongoDB URI: {os.environ.get('MONGODB_URI', 'Not set')}")
        
        # Test raw PyMongo connection
        client = db._client
        db_name = getattr(db, 'database_name', 'graidea')
        raw_db = client[db_name]
        collections = raw_db.list_collection_names()
        print(f"Available collections: {collections}")
        
        # Test reviews collection specifically
        if "reviews" in collections:
            count = raw_db.reviews.count_documents({})
            print(f"Reviews collection has {count} documents")
            
            # Show a sample document
            sample = raw_db.reviews.find_one()
            if sample:
                print(f"Sample document structure:")
                print(f"  Type: {type(sample)}")
                print(f"  Keys: {list(sample.keys())}")
                print(f"  Content: {sample}")
            else:
                print("No documents found in reviews collection")
        else:
            print("Reviews collection not found")
            print("Available collections:", collections)
            
    except Exception as e:
        print(f"Database connection test failed: {e}")
        import traceback
        traceback.print_exc()

def create_sample_data():
    """Create sample review data if the database is empty"""
    try:
        client = db._client
        db_name = getattr(db, 'database_name', 'graidea')
        raw_db = client[db_name]
        
        # Check if reviews collection exists and has data
        if "reviews" not in raw_db.list_collection_names():
            print("Creating reviews collection...")
        else:
            count = raw_db.reviews.count_documents({})
            if count > 0:
                print(f"Reviews collection already has {count} documents")
                return
        
        # Create sample reviews
        sample_reviews = [
            {
                "studentId": 1,
                "teacherId": 1,
                "studentName": "Alice Johnson",
                "teacherName": "Dr. Smith",
                "rating": 5,
                "review": "Excellent teacher! Very clear explanations and helpful with assignments."
            },
            {
                "studentId": 2,
                "teacherId": 1,
                "studentName": "Bob Wilson",
                "teacherName": "Dr. Smith",
                "rating": 4,
                "review": "Good teacher, but sometimes the lectures are a bit fast-paced."
            },
            {
                "studentId": 3,
                "teacherId": 2,
                "studentName": "Carol Davis",
                "teacherName": "Prof. Johnson",
                "rating": 5,
                "review": "Amazing professor! Makes complex topics easy to understand."
            },
            {
                "studentId": 4,
                "teacherId": 2,
                "studentName": "David Brown",
                "teacherName": "Prof. Johnson",
                "rating": 3,
                "review": "Average teacher. The course material is good but delivery could be better."
            },
            {
                "studentId": 5,
                "teacherId": 3,
                "studentName": "Eva Martinez",
                "teacherName": "Dr. Williams",
                "rating": 4,
                "review": "Very knowledgeable and approachable. Great for beginners."
            }
        ]
        
        # Insert sample data
        result = raw_db.reviews.insert_many(sample_reviews)
        print(f"Created {len(result.inserted_ids)} sample reviews")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")

# Test database connection first
test_database_connection()

# Create sample data if needed
create_sample_data()

# Load reviews into vector store
load_reviews_to_vector_store()

# Print available tools for debugging
print("\nAvailable tools:")
all_tools = [
    search_tool,
    vector_search_tool,
    teacher_reviews_tool,
    recommendations_tool,
] + db_tools
for i, tool in enumerate(all_tools):
    print(f"{i}: {tool.name} - {tool.description}")

# Create the ReAct prompt template
react_prompt = PromptTemplate.from_template("""
You are a helpful assistant that can answer questions about teacher reviews and provide recommendations.

You have access to the following tools:

{tools}

IMPORTANT TOOL USAGE: 
- Use search_reviews to find relevant teacher reviews using vector similarity
- Use get_teacher_reviews when you need all reviews for a specific teacher (provide teacherId as a number)
- Use get_recommendations to provide teacher recommendations based on user queries
- Use MongoDB tools only when you need to query the database directly
- Use Tavily search for general information not in the reviews

TOOL SELECTION GUIDE:
- For general review searches: use search_reviews
- For specific teacher analysis: use get_teacher_reviews with teacherId
- For recommendations: use get_recommendations
- For database queries: use MongoDB tools
- For external information: use Tavily search

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought: {agent_scratchpad}
""")

# Create the agent with all tools including vector search
agent = create_react_agent(llm=llm, tools=all_tools, prompt=react_prompt)

# Create agent executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=all_tools,
    verbose=True,
    max_iterations=5,
    handle_parsing_errors=True,
)

if __name__ == "__main__":
    # Interactive loop
    print("\n" + "=" * 60)
    print("Teacher Review Chatbot with Advanced Analytics")
    print("=" * 60)
    print("Available Commands:")
    print("- Ask questions about teacher reviews")
    print("- Get recommendations for specific needs")
    print("- Analyze specific teachers by ID")
    print("- Type 'reload' to reload reviews from MongoDB")
    print("- Type 'quit', 'exit', or 'q' to exit")
    print("\nExample Queries:")
    print("- 'Show me reviews for teacher ID 123'")
    print("- 'Recommend teachers for math courses'")
    print("- 'What do students say about homework?'")
    print("- 'Find the best teachers for beginners'")
    print("=" * 60)

    while True:
        user_input = input("\nUser: ").strip()

        if user_input.lower() in ("quit", "exit", "q"):
            print("Goodbye!")
            break

        if user_input.lower() == "reload":
            print("Reloading reviews from MongoDB...")
            load_reviews_to_vector_store()
            continue

        if not user_input:
            continue

        try:
            # Run the agent
            result = agent_executor.invoke({"input": user_input})
            print("\nAssistant:", result["output"])
        except Exception as e:
            print(f"Error: {e}")
