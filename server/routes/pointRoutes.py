from fastapi import APIRouter
from controllers.pointControllers import delete_all_points, seed_points, fetch_points, fetch_points_by_disease
router = APIRouter()

# POST      /points/seed-points
router.add_api_route("/seed-points", methods=['POST'], endpoint=seed_points)

# GET       /points
router.add_api_route("/", methods=['GET'], endpoint=fetch_points)

# GET       /points/disease
router.add_api_route("/disease", methods=['GET'], endpoint=fetch_points_by_disease)

# DELETE    /points/all
router.add_api_route("/all", methods=['DELETE'], endpoint=delete_all_points)