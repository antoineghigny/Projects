import datetime
import enum
import random
from typing import List, Dict, Tuple

import pendulum
import uvicorn
from fastapi import FastAPI, Path, HTTPException, Query, APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

router = APIRouter(tags=["exercise"])
bonus_router = APIRouter(tags=["bonus"])

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@router.get("/")
def root():
    return "Welcome to Amoobi's recruitment exercise!"


class WeekStrategy(enum.IntEnum):
    strategy_1 = 1
    strategy_2 = 4
    strategy_3 = 7


class Store(BaseModel):
    id: int
    name: str
    week_strategy: WeekStrategy


@router.get("/stores")
def get_stores() -> List[Store]:
    """
    Return a list of stores.
    """
    stores = [
        Store(id=1, name="Store A", week_strategy=WeekStrategy.strategy_1),
        Store(id=2, name="Store B", week_strategy=WeekStrategy.strategy_2),
        Store(id=3, name="Store C", week_strategy=WeekStrategy.strategy_3),
    ]

    # Randomly raise an error 10% of the time to see how the candidate handles it
    if random.randint(1, 10) == 1:
        raise HTTPException(
            status_code=500,
            detail="The server encountered an error"
        )

    return stores


def _is_valid(date: datetime.date) -> bool:
    """
    Check if a given date is valid, i.e. it is within the authorized bounds.

    :param date: date to test
    :return: True if date is valid, False otherwise
    """
    start_date = datetime.date.fromisocalendar(2022, 42, 1)
    end_date = datetime.date.fromisocalendar(2023, 29, 1)
    return start_date <= date <= end_date


@router.get("/date-validity/{year}/{week}")
def get_date_validity(
        year: int = Path(description="Year as a 4 digit number", example="2023"),
        week: int = Path(description="Week number", example="9", ge=1, le=53),
        week_strategy: WeekStrategy = Query(
            description="Week strategy used to determine the date",
            example=WeekStrategy.strategy_1,
        )
) -> bool:
    """
    Return True if the week/year combination is valid, False otherwise.
    """
    try:
        date = datetime.date.fromisocalendar(year, week, week_strategy.value)
        return _is_valid(date)
    except ValueError:
        return False


@router.get("/date/{year}/{week}")
def get_date(
        year: int = Path(description="Year as a 4 digit number", example="2023"),
        week: int = Path(description="Week number", example="9", ge=1, le=53),
        week_strategy: WeekStrategy = Query(
            description="Week strategy used to determine the date",
            example=WeekStrategy.strategy_1,
        )
) -> datetime.date:
    """
    Return the date corresponding to the given week, year & week strategy.
    """
    try:
        date = datetime.date.fromisocalendar(year, week, week_strategy.value)

        # Randomly raise an error 10% of the time to see how the candidate handles it
        if random.randint(1, 10) == 1:
            raise HTTPException(
                status_code=418,
                detail="I'm a teapot"
            )
        return date

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=e.args
        )


class Data(BaseModel):
    visitors_per_week: Dict[datetime.date, int]
    turnover_per_week: Dict[datetime.date, float]


@router.get("/data")
def get_data(
        store_id: int = Query(description="Store ID", example=1, ge=1),
        start_date: datetime.date = Query(description="Period start date", example=datetime.date(2023, 4, 10)),
        end_date: datetime.date = Query(description="Period end date", example=datetime.date(2023, 7, 17)),
) -> Data:
    """
    Return data corresponding to the given store & period.
    """
    stores = get_stores()
    if store_id not in [s.id for s in stores]:
        raise HTTPException(
            status_code=404,
            detail=f"Store {store_id} does not exist",
        )

    if not _is_valid(start_date):
        raise HTTPException(
            status_code=400,
            detail=f"Start date ({start_date}) is out of bounds",
        )

    if not _is_valid(end_date):
        raise HTTPException(
            status_code=400,
            detail=f"End date ({end_date}) is out of bounds",
        )

    if start_date >= end_date:
        raise HTTPException(
            status_code=400,
            detail=f"Start date ({start_date}) must precede end date ({end_date})",
        )

    if start_date.isoweekday() != end_date.isoweekday():
        raise HTTPException(
            status_code=400,
            detail=f"Start date ({start_date}) and end date ({end_date}) do not share the same weekday",
        )

    # Define seed for reproducibility
    seed = f"{store_id}-{start_date.isoformat()}-{end_date.isoformat()}"
    random.seed(seed)

    # Generate data
    visitors = {}
    turnover = {}

    period = pendulum.period(start_date, end_date)
    for dt in period.range("weeks"):
        visitors[dt] = int(random.gauss(mu=1200, sigma=300))
        turnover[dt] = round(random.gauss(mu=50000, sigma=5000), 2)

    return Data(visitors_per_week=visitors, turnover_per_week=turnover)


@router.get("/check-friday-13/{year}/{month}")
def check_friday_13(
    year: int = Path(description="Year as a 4 digit number", example="2023"),
    month: int = Path(description="Month as a 1 or 2 digit number", example="10"),
):
    """
    Check if a given year and month have a Friday the 13th.
    """
    try:
        target_date = datetime.date(year, month, 13)
        is_friday_13 = target_date.weekday() == 4  # 4 corresponds to Friday
        return {"is_friday_13": is_friday_13}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date provided")


@bonus_router.get("/map")
def get_map():
    """
    Return a PNG image representing the store map.
    """
    return FileResponse("../../images/store_map.png")


class BoundingBox(BaseModel):
    min_x: int
    max_x: int
    min_y: int
    max_y: int


@bonus_router.get("/bbox")
def get_bounding_box() -> BoundingBox:
    """
    Return the store's bounding box.

    See README for more detail.
    """
    return BoundingBox(min_x=184, max_x=35397, min_y=-50542, max_y=-35027)


class Point(BaseModel):
    x: int
    y: int


class Zone(BaseModel):
    id: int
    name: str
    color: Tuple[int, int, int, int] = Field(example=(0, 0, 255, 255))
    coords: List[List[Point]]


@bonus_router.get("/zones")
def get_zones() -> List[Zone]:
    """
    Return a list of zones.
    """
    return [
        Zone(
            id=4519,
            name="Pasta",
            color=(255, 0, 255, 255),
            coords=[
                [
                    Point(x=4909, y=-38682),
                    Point(x=6935, y=-38682),
                    Point(x=11998, y=-38682),
                    Point(x=11998, y=-38135),
                    Point(x=12488, y=-38135),
                    Point(x=12488, y=-39252),
                    Point(x=4909, y=-39252),
                ],
                [
                    Point(x=5388, y=-41190),
                    Point(x=12468, y=-41190),
                    Point(x=12468, y=-41713),
                    Point(x=5388, y=-41713),
                ]
            ]
        ),
        Zone(
            id=4520,
            name="Sauces",
            color=(240, 230, 140, 255),
            coords=[
                [
                    Point(x=6935, y=-38135),
                    Point(x=11998, y=-38135),
                    Point(x=11998, y=-38682),
                    Point(x=6935, y=-38682),
                ]
            ]
        ),
        Zone(
            id=4570,
            name="Beers",
            color=(221, 160, 221, 255),
            coords=[
                [
                    Point(x=5574, y=-44393),
                    Point(x=7572, y=-44393),
                    Point(x=7572, y=-45179),
                    Point(x=5574, y=-45179),
                ]
            ]
        ),
        Zone(
            id=4522,
            name="Merchandising",
            color=(255, 0, 0, 255),
            coords=[
                [
                    Point(x=4848, y=-41190),
                    Point(x=5388, y=-41190),
                    Point(x=5388, y=-41713),
                    Point(x=5388, y=-42558),
                    Point(x=4848, y=-42558),
                ],
                [
                    Point(x=12468, y=-41190),
                    Point(x=13006, y=-41190),
                    Point(x=13006, y=-42558),
                    Point(x=12468, y=-42558),
                    Point(x=12468, y=-41713),
                ],
                [
                    Point(x=4357, y=-38135),
                    Point(x=4909, y=-38135),
                    Point(x=4909, y=-38682),
                    Point(x=4909, y=-39252),
                    Point(x=4357, y=-39252),
                ],
                [
                    Point(x=28756, y=-44393),
                    Point(x=29333, y=-44393),
                    Point(x=29333, y=-46041),
                    Point(x=28756, y=-46041),
                    Point(x=28756, y=-45179),
                ],
                [
                    Point(x=4688, y=-44393),
                    Point(x=5574, y=-44393),
                    Point(x=5574, y=-45179),
                    Point(x=5574, y=-46041),
                    Point(x=4688, y=-46041),
                ]
            ]
        ),
        Zone(
            id=4571,
            name="Bread",
            color=(0, 255, 255, 255),
            coords=[
                [
                    Point(x=22280, y=-48546),
                    Point(x=27669, y=-48546),
                    Point(x=27669, y=-49347),
                    Point(x=22280, y=-49347),
                ],
                [
                    Point(x=29785, y=-48729),
                    Point(x=32489, y=-48729),
                    Point(x=32489, y=-49554),
                    Point(x=29785, y=-49554),
                ],
                [
                    Point(x=32489, y=-47407),
                    Point(x=33329, y=-47407),
                    Point(x=33329, y=-48729),
                    Point(x=32489, y=-48729),
                ],
            ]
        ),
        Zone(
            id=4524,
            name="Pizza",
            color=(255, 255, 0, 255),
            coords=[
                [
                    Point(x=2285, y=-48546),
                    Point(x=4749, y=-48546),
                    Point(x=4749, y=-49347),
                    Point(x=2285, y=-49347),
                ],
                [
                    Point(x=1482, y=-44519),
                    Point(x=2285, y=-44519),
                    Point(x=2285, y=-48546),
                    Point(x=1482, y=-48546),
                ],
            ]
        ),
        Zone(
            id=4525,
            name="Frozen",
            color=(255, 228, 181, 255),
            coords=[
                [
                    Point(x=5574, y=-45179),
                    Point(x=7572, y=-45179),
                    Point(x=28756, y=-45179),
                    Point(x=28756, y=-46041),
                    Point(x=5574, y=-46041),
                ],
            ]
        ),
        Zone(
            id=4526,
            name="Beers",
            color=(255, 140, 0, 255),
            coords=[
                [
                    Point(x=5388, y=-41713),
                    Point(x=12468, y=-41713),
                    Point(x=12468, y=-42558),
                    Point(x=5388, y=-42558),
                ],
                [
                    Point(x=1482, y=-37766),
                    Point(x=2285, y=-37766),
                    Point(x=2285, y=-44519),
                    Point(x=1482, y=-44519),
                ],
            ]
        ),
        Zone(
            id=4527,
            name="Liquors",
            color=(250, 128, 114, 255),
            coords=[
                [
                    Point(x=4909, y=-38135),
                    Point(x=6935, y=-38135),
                    Point(x=6935, y=-38682),
                    Point(x=4909, y=-38682),
                ],
            ]
        ),
        Zone(
            id=4528,
            name="Wines",
            color=(255, 165, 0, 255),
            coords=[
                [
                    Point(x=4749, y=-48546),
                    Point(x=22280, y=-48546),
                    Point(x=22280, y=-49347),
                    Point(x=4749, y=-49347),
                ],
            ]
        ),
    ]


app.include_router(router)
app.include_router(bonus_router)

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8001)
