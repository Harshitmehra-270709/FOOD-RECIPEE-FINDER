import os
from supabase import create_client, Client
from typing import Dict, Any
from datetime import datetime

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials")

supabase: Client = create_client(supabase_url, supabase_key)

def calculate_recipe_ratings(recipe_id: str) -> Dict[str, Any]:
    """
    Calculate average rating and total reviews for a recipe
    """
    try:
        # Get all ratings for the recipe
        response = supabase.table("ratings").select("rating").eq("recipe_id", recipe_id).execute()
        
        if not response.data:
            return {
                "average_rating": 0,
                "total_reviews": 0,
                "last_updated": datetime.utcnow().isoformat()
            }
        
        ratings = [r["rating"] for r in response.data]
        average_rating = sum(ratings) / len(ratings)
        total_reviews = len(ratings)
        
        return {
            "average_rating": round(average_rating, 1),
            "total_reviews": total_reviews,
            "last_updated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Error calculating ratings for recipe {recipe_id}: {str(e)}")
        raise

def update_recipe_stats(recipe_id: str) -> Dict[str, Any]:
    """
    Update recipe statistics in the database
    """
    try:
        # Calculate new ratings
        stats = calculate_recipe_ratings(recipe_id)
        
        # Update the recipe_stats table
        response = supabase.table("recipe_stats").upsert({
            "recipe_id": recipe_id,
            "average_rating": stats["average_rating"],
            "total_reviews": stats["total_reviews"],
            "last_updated": stats["last_updated"]
        }, on_conflict="recipe_id").execute()
        
        return stats
    except Exception as e:
        print(f"Error updating recipe stats for {recipe_id}: {str(e)}")
        raise

def handle_rating_update(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle rating update webhook
    """
    try:
        recipe_id = payload.get("record", {}).get("recipe_id")
        if not recipe_id:
            raise ValueError("Missing recipe_id in payload")
            
        return update_recipe_stats(recipe_id)
    except Exception as e:
        print(f"Error handling rating update: {str(e)}")
        raise 