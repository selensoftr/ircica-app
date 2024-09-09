import os
import json


def make_geojson(json_files):
    geo_json = {"type": "FeatureCollection", "features": []}
    for json_file in json_files:
        with open(
            os.path.join("html", "json_dumps", json_file), "r", encoding="utf-8"
        ) as fp:
            data = json.load(fp)

        for key, value in data.items():
            if value["lat"]:
                gj_feature = {
                    "type": "Feature",
                    "geometry": {"type": "Point"},
                    "properties": {},
                }
                try:
                    gj_feature["geometry"]["coordinates"] = [
                        float(value["long"]),
                        float(value["lat"]),
                    ]
                except TypeError:
                    print("###########")
                    print(
                        f"looks like there is an issue with coordinates for entry: {value['name']}"
                    )
                    print("###########")
                    continue
                gj_feature["properties"]["name"] = value["name"]
                gj_feature["properties"]["grocerist_id"] = value["grocerist_id"]
                gj_feature["properties"]["documents"] = value["documents"]
                gj_feature["properties"]["doc_count"] = len(value["documents"])
                gj_feature["properties"]["persons"] = value["persons"]
                gj_feature["properties"]["person_count"] = len(value["persons"])
                if "neighbourhood" in value["grocerist_id"]:
                    gj_feature["properties"]["location_type"] = "Mahalle"
                else:
                    gj_feature["properties"]["location_type"] = (
                        value["grocerist_id"].split("_")[0].capitalize()
                    )
                geo_json["features"].append(gj_feature)

    with open(
        os.path.join("html", "json_dumps", "locations.json"), "w", encoding="utf-8"
    ) as fp:
        json.dump(geo_json, fp, ensure_ascii=False)


json_files = ["districts.json", "neighbourhoods.json", "karye.json"]
make_geojson(json_files)
