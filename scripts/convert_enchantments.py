from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path
from typing import Any


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value


def parse_int(value: Any) -> int:
    if value is None:
        return 0
    s = str(value).strip()
    if not s or s.lower() == "nan":
        return 0
    s = s.replace(",", "")
    try:
        return int(float(s))
    except ValueError:
        return 0


def parse_list(value: Any) -> list[str]:
    if value is None:
        return []
    s = str(value).strip()
    if not s or s.lower() == "nan":
        return []
    return [part.strip() for part in s.split(",") if part.strip()]


def choose_weight_columns(use_adjusted: bool) -> dict[str, str]:
    if use_adjusted:
        return {
            1: "Adjusted T1",
            2: "Adjusted T2",
            3: "Adjusted T3",
            4: "Adjusted T4",
        }
    return {
        1: "T1",
        2: "T2",
        3: "T3",
        4: "T4 or MAX",
    }


def row_to_definition(row: dict[str, Any], use_adjusted: bool, include_awakened: bool) -> dict[str, Any] | None:
    name = str(row.get("Enchantment", "")).strip()
    if not name or name.lower() == "nan":
        return None

    labels = parse_list(row.get("Enchantment Labels"))
    is_unique = "UNIQUE" in labels
    is_awakened = "AWAKENED" in labels

    if is_awakened and not include_awakened:
        return None

    incompatible_groups = parse_list(row.get("Incompatible"))
    item_labels = parse_list(row.get("Item Labels"))
    incompatible_labels = parse_list(row.get("Incompatible Labels"))

    weight_columns = choose_weight_columns(use_adjusted)

    tiers: list[dict[str, Any]] = []

    # Unique / awakened enchantments have a single roll instead of T1-T4.
    if is_unique or is_awakened:
        max_weight = parse_int(row.get(weight_columns[4]))
        if max_weight > 0:
            tiers.append({"tier": "MAX", "weight": max_weight})
    else:
        for tier_num in (1, 2, 3, 4):
            weight = parse_int(row.get(weight_columns[tier_num]))
            if weight > 0:
                tiers.append({"tier": tier_num, "weight": weight})

    if not tiers:
        return None

    total_weight = sum(t["weight"] for t in tiers)

    definition = {
        "id": slugify(name),
        "name": name,
        "labels": labels,
        "itemLabels": item_labels,
        "incompatibleGroups": incompatible_groups,
        "incompatibleLabels": incompatible_labels,
        "isUnique": is_unique,
        "isAwakened": is_awakened,
        "maxCopiesPerItem": 1,
        "tiers": tiers,
        "totalWeight": total_weight,
    }

    return definition


def convert_csv(input_path: Path, output_path: Path, use_adjusted: bool, include_awakened: bool) -> None:
    enchantments: list[dict[str, Any]] = []

    with input_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            definition = row_to_definition(row, use_adjusted=use_adjusted, include_awakened=include_awakened)
            if definition is not None:
                enchantments.append(definition)

    payload = {
        "meta": {
            "source": input_path.name,
            "weightMode": "adjusted" if use_adjusted else "base",
            "includesAwakened": include_awakened,
            "notes": [
                "EQUIPMENT means all gear types.",
                "Exact duplicate enchantments are disallowed.",
                "Unique and awakened enchantments use a single MAX tier.",
            ],
        },
        "enchantments": enchantments,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Wrote {len(enchantments)} enchantments to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert enchantment CSV into normalized JSON.")
    parser.add_argument("input", type=Path, help="Path to the source CSV")
    parser.add_argument("output", type=Path, help="Path to the output JSON")
    parser.add_argument(
        "--use-adjusted",
        action="store_true",
        help="Use Adjusted T1-T4 columns instead of base T1-T4 columns.",
    )
    parser.add_argument(
        "--include-awakened",
        action="store_true",
        help="Include awakened enchantments in the output.",
    )
    args = parser.parse_args()

    convert_csv(
        input_path=args.input,
        output_path=args.output,
        use_adjusted=args.use_adjusted,
        include_awakened=args.include_awakened,
    )
