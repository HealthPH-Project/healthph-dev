from fastapi import APIRouter
from controllers.pointControllers import delete_all_points, seed_points, fetch_points, fetch_points_by_disease, create_points
router = APIRouter()

router.add_api_route("/seed-points", methods=['POST'], endpoint=seed_points)

router.add_api_route("/", methods=['GET'], endpoint=fetch_points)

router.add_api_route("/disease", methods=['GET'], endpoint=fetch_points_by_disease)

router.add_api_route("/all", methods=['DELETE'], endpoint=delete_all_points)

router.add_api_route("/test", methods=['GET'], endpoint=create_points)