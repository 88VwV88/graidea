from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import json
import agent

app = FastAPI(
    title="Teacher Review API",
    description="API for caching teacher reviews and providing recommendations",
    version="1.0.0",
)


# Pydantic models for request/response
class TeacherQuery(BaseModel):
    teacher_id: int


class SearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 5


class RecommendationQuery(BaseModel):
    query: str
    limit: Optional[int] = 5


class CacheResponse(BaseModel):
    success: bool
    message: str
    total_reviews: Optional[int] = None
    error: Optional[str] = None


class ReviewResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class RecommendationResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Teacher Review API",
        "version": "1.0.0",
        "endpoints": {
            "cache_reviews": "POST /cache-reviews - Cache all reviews from MongoDB",
            "get_teacher_reviews": "POST /teacher-reviews - Get reviews for specific teacher",
            "search_reviews": "POST /search-reviews - Search reviews using vector similarity",
            "get_recommendations": "POST /recommendations - Get teacher recommendations",
            "health": "GET /health - Check API health",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "vector_store_loaded": agent.vector_store is not None,
        "message": "API is running",
    }


@app.post("/cache-reviews", response_model=CacheResponse)
async def cache_reviews():
    """Cache all reviews from MongoDB into the vector store"""
    try:
        # Store the current vector store state
        old_count = agent.vector_store.ntotal if agent.vector_store else 0

        # Load reviews into vector store
        agent.load_reviews_to_vector_store()

        # Get new count
        new_count = agent.vector_store.ntotal if agent.vector_store else 0
        added_reviews = new_count - old_count

        return CacheResponse(
            success=True,
            message=f"Successfully cached reviews. Added {added_reviews} new reviews.",
            total_reviews=new_count,
        )
    except Exception as e:
        return CacheResponse(
            success=False, message="Failed to cache reviews", error=str(e)
        )


@app.post("/teacher-reviews", response_model=ReviewResponse)
async def get_teacher_reviews(query: TeacherQuery):
    """Get all reviews for a specific teacher by teacherId"""
    try:
        if agent.vector_store is None:
            raise HTTPException(
                status_code=400,
                detail="Vector store not initialized. Please cache reviews first.",
            )

        # Get teacher reviews using the tool
        result = agent.get_teacher_reviews_tool(str(query.teacher_id))

        # Parse the JSON result
        data = json.loads(result)

        return ReviewResponse(success=True, data=data)
    except json.JSONDecodeError:
        return ReviewResponse(
            success=False, error="Invalid response format from database"
        )
    except Exception as e:
        return ReviewResponse(success=False, error=str(e))


@app.post("/search-reviews", response_model=ReviewResponse)
async def search_reviews(query: SearchQuery):
    """Search for reviews using vector similarity"""
    try:
        if agent.vector_store is None:
            raise HTTPException(
                status_code=400,
                detail="Vector store not initialized. Please cache reviews first.",
            )

        # Search reviews using the tool
        result = agent.search_reviews_tool(query.query)

        # Parse the JSON result
        data = json.loads(result)

        return ReviewResponse(success=True, data=data)
    except json.JSONDecodeError:
        return ReviewResponse(
            success=False, error="Invalid response format from vector store"
        )
    except Exception as e:
        return ReviewResponse(success=False, error=str(e))


@app.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(query: RecommendationQuery):
    """Get teacher recommendations based on query"""
    try:
        if agent.vector_store is None:
            raise HTTPException(
                status_code=400,
                detail="Vector store not initialized. Please cache reviews first.",
            )

        # Get recommendations using the tool
        result = agent.get_recommendations_tool(query.query)

        # Parse the JSON result
        data = json.loads(result)

        return RecommendationResponse(success=True, data=data)
    except json.JSONDecodeError:
        return RecommendationResponse(
            success=False, error="Invalid response format from recommendation engine"
        )
    except Exception as e:
        return RecommendationResponse(success=False, error=str(e))


@app.post("/agent-query")
async def agent_query(query: SearchQuery):
    """Use the full agent to process a query and provide intelligent responses"""
    try:
        if agent.vector_store is None:
            raise HTTPException(
                status_code=400,
                detail="Vector store not initialized. Please cache reviews first.",
            )

        # Use the agent executor to process the query
        result = agent.agent_executor.invoke({"input": query.query})

        return {
            "success": True,
            "query": query.query,
            "response": result["output"],
            "agent_used": True,
        }
    except Exception as e:
        return {"success": False, "error": str(e), "agent_used": True}


@app.get("/stats")
async def get_stats():
    """Get statistics about the cached reviews"""
    try:
        stats = {
            "vector_store_loaded": agent.vector_store is not None,
            "total_documents": getattr(agent.vector_store, 'ntotal', 0) if agent.vector_store else 0,
            "vector_dimension": getattr(agent.vector_store, 'd', 0) if agent.vector_store else 0,
            "index_type": type(agent.vector_store).__name__ if agent.vector_store else "None",
        }

        return {"success": True, "stats": stats}
    except Exception as e:
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
