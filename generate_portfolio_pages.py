from __future__ import annotations

import html
import json
import re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "assets" / "data" / "projects.json"
BASE_URL = "https://jasonrae.ai"
SOCIAL_ALT = (
    "Jason Rae — Commercial Analytics Architect & Applied AI Leader"
)


def load_data() -> dict:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def prettify_metric_label(value: str) -> str:
    words = re.sub(r"(?<!^)([A-Z])", r" \1", value).replace("_", " ")
    return words.title()


def escape(value: str) -> str:
    return html.escape(value, quote=True)


def join_url(relative_path: str) -> str:
    return f"{BASE_URL}/{relative_path.lstrip('/')}"


def image_exists(relative_path: str) -> bool:
    return (BASE_DIR / relative_path).exists()


def read_text(relative_path: str) -> str:
    return (BASE_DIR / relative_path).read_text(encoding="utf-8")


def write_text(relative_path: str, content: str) -> None:
    (BASE_DIR / relative_path).write_text(content, encoding="utf-8")


def replace_once(content: str, pattern: str, replacement: str) -> str:
    updated, count = re.subn(pattern, replacement, content, count=1, flags=re.DOTALL)
    if count != 1:
        raise ValueError(f"Pattern not found exactly once: {pattern}")
    return updated


def validate_data(data: dict) -> None:
    category_ids = {category["id"] for category in data["categories"]}

    for project in data["projects"]:
        if project["category"] not in category_ids:
            raise ValueError(f"Unknown project category: {project['id']}")
        if not image_exists(project["image"]):
            raise FileNotFoundError(f"Missing project image: {project['image']}")
        if project.get("caseStudyUrl"):
            if not project.get("detailPage"):
                raise ValueError(f"Missing detailPage config for {project['id']}")
            target = BASE_DIR / project["caseStudyUrl"]
            if not target.exists():
                raise FileNotFoundError(
                    f"Missing case-study file for {project['id']}: {project['caseStudyUrl']}"
                )

    for case_study in data.get("caseStudies", []):
        if case_study["category"] not in category_ids:
            raise ValueError(f"Unknown case-study category: {case_study['id']}")
        if not case_study.get("displayCategory"):
            raise ValueError(f"Missing displayCategory for case study: {case_study['id']}")


def category_name_map(data: dict) -> dict[str, str]:
    return {category["id"]: category["name"] for category in data["categories"]}


def render_filter_tabs(data: dict) -> str:
    buttons = []
    for index, category in enumerate(data["categories"]):
        is_active = index == 0
        button_class = "btn btn-primary" if is_active else "btn btn-secondary"
        buttons.append(
            f"""    <section class=\"section-sm\" style=\"padding-top: 0\">\n      <div class=\"container\">\n        <div\n          style=\"\n            display: flex;\n            justify-content: center;\n            gap: var(--space-4);\n            flex-wrap: wrap;\n            margin-bottom: var(--space-8);\n          \"\n        >\n{render_filter_buttons(data["categories"])}\n        </div>\n      </div>\n    </section>"""
        )
        break
    return buttons[0]


def render_filter_buttons(categories: list[dict]) -> str:
    rendered = []
    for index, category in enumerate(categories):
        is_active = index == 0
        button_class = "btn btn-primary filter-btn active" if is_active else "btn btn-secondary filter-btn"
        rendered.append(
            f"""          <button class=\"{button_class}\" data-filter=\"{escape(category['id'])}\">\n            {escape(category['name'])}\n          </button>"""
        )
    return "\n".join(rendered)


def render_item_list_schema(data: dict) -> str:
    items = []
    position = 1

    for project in data["projects"]:
        if project.get("caseStudyUrl"):
            url = join_url(project["caseStudyUrl"])
        else:
            url = f"{join_url('portfolio.html')}#{project['id']}"
        items.append(
            {
                "@type": "ListItem",
                "position": position,
                "name": project["title"],
                "description": project["description"],
                "url": url,
            }
        )
        position += 1

    for case_study in data.get("caseStudies", []):
        items.append(
            {
                "@type": "ListItem",
                "position": position,
                "name": case_study["title"],
                "description": case_study["description"],
                "url": f"{join_url('portfolio.html')}#{case_study['id']}",
            }
        )
        position += 1

    schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Jason Rae Proof Of Work",
        "description": "Commercial analytics case studies and production-grade AI systems by Jason Rae.",
        "url": join_url("portfolio.html"),
        "itemListElement": items,
    }

    schema_json = json.dumps(schema, ensure_ascii=False, indent=2)
    return (
        "    <!-- Schema.org markup -->\n"
        "    <script type=\"application/ld+json\">\n"
        + "\n".join(f"      {line}" for line in schema_json.splitlines())
        + "\n    </script>"
    )


def render_featured_project(project: dict, category_label: str) -> str:
    metrics = "\n".join(
        f"                <li>\n                  <strong>{escape(prettify_metric_label(label))}:</strong> {escape(value)}\n                </li>"
        for label, value in project["metrics"].items()
    )
    tech_tags = "\n".join(
        f"                <span class=\"tag tech-tag\">{escape(technology)}</span>"
        for technology in project["technologies"]
    )

    button = ""
    if project.get("caseStudyUrl"):
        button = (
            "\n              <div class=\"case-study-actions\">\n"
            f"                <a\n                  href=\"{escape(project['caseStudyUrl'])}\"\n                  class=\"btn btn-primary\"\n                  >View Case Study</a\n                >\n"
            "              </div>"
        )

    return f"""    <section class=\"section-sm\" style=\"padding-top: 0\">\n      <div class=\"container\">\n        <div\n          class=\"card project-card reveal\"\n          data-category=\"{escape(project['category'])}\"\n          id=\"{escape(project['id'])}\"\n          style=\"\n            background: var(--gradient-card);\n            border: 1px solid var(--color-accent);\n            padding: 0;\n            overflow: hidden;\n          \"\n        >\n          <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 0\">\n            <div class=\"project-featured-visual-wrapper\">\n              <img\n                src=\"{escape(project['image'])}\"\n                alt=\"Visualization of the {escape(project['title'])} project\"\n                width=\"600\"\n                height=\"400\"\n                loading=\"lazy\"\n              />\n            </div>\n            <div style=\"padding: var(--space-8)\">\n              <div\n                style=\"\n                  display: flex;\n                  align-items: center;\n                  gap: var(--space-3);\n                  flex-wrap: wrap;\n                  margin-bottom: var(--space-4);\n                \"\n              >\n                <span class=\"badge badge-primary\">{escape(category_label)}</span>\n                <span class=\"badge badge-warning\">{escape(project['year'])}</span>\n                <span class=\"badge badge-success\">{escape(project['status'])}</span>\n              </div>\n              <h2\n                style=\"\n                  font-size: var(--text-3xl);\n                  margin-bottom: var(--space-4);\n                \"\n              >\n                {escape(project['title'])}\n              </h2>\n              <p\n                style=\"font-size: var(--text-lg); margin-bottom: var(--space-6)\"\n              >\n                {escape(project['longDescription'])}\n              </p>\n\n              <h4\n                style=\"\n                  font-size: var(--text-base);\n                  margin-bottom: var(--space-3);\n                \"\n              >\n                Key Highlights\n              </h4>\n              <ul class=\"list-check\" style=\"margin-bottom: var(--space-6)\">\n{metrics}\n              </ul>\n\n              <div class=\"tags\" style=\"margin-bottom: var(--space-6)\">\n{tech_tags}\n              </div>{button}\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>"""


def render_project_card(project: dict, category_label: str) -> str:
    business_relevance = ""
    if project.get("businessRelevance"):
        business_relevance = (
            "\n              <p style=\"margin-bottom: var(--space-4)\">\n"
            f"                <strong>Business relevance:</strong> {escape(project['businessRelevance'])}\n"
            "              </p>"
        )

    tech_tags = "\n".join(
        f"                <span class=\"tech-tag\">{escape(technology)}</span>"
        for technology in project["technologies"][:5]
    )
    highlights = "\n".join(
        f"                <li>{escape(highlight)}</li>" for highlight in project["highlights"][:3]
    )
    button = ""
    if project.get("caseStudyUrl"):
        button = (
            "\n              <div class=\"case-study-actions\">\n"
            f"                <a\n                  href=\"{escape(project['caseStudyUrl'])}\"\n                  class=\"btn btn-secondary\"\n                  >View Case Study</a\n                >\n"
            "              </div>"
        )

    return f"""          <article class=\"project-card reveal\" data-category=\"{escape(project['category'])}\" id=\"{escape(project['id'])}\">\n            <img\n              src=\"{escape(project['image'])}\"\n              class=\"project-image\"\n              alt=\"Illustration representing the {escape(project['title'])} project\"\n              width=\"800\"\n              height=\"500\"\n              loading=\"lazy\"\n            />\n            <div class=\"project-content\">\n              <div\n                style=\"\n                  display: flex;\n                  align-items: center;\n                  justify-content: space-between;\n                  gap: var(--space-3);\n                  margin-bottom: var(--space-2);\n                  flex-wrap: wrap;\n                \"\n              >\n                <p class=\"project-type\" style=\"margin-bottom: 0\">{escape(category_label)}</p>\n                <span class=\"badge badge-warning\">{escape(project['year'])}</span>\n              </div>\n              <h3 class=\"project-title\">{escape(project['title'])}</h3>\n              <p class=\"project-desc\">{escape(project['description'])}</p>{business_relevance}\n\n              <div class=\"project-tech\">\n{tech_tags}\n              </div>\n\n              <ul class=\"list-check\" style=\"margin-bottom: 0\">\n{highlights}\n              </ul>{button}\n            </div>\n          </article>"""


def render_build_proof_section(projects: list[dict], category_names: dict[str, str]) -> str:
    cards = "\n\n".join(
        render_project_card(project, category_names[project["category"]])
        for project in projects
    )
    return f"""    <section class=\"section\">\n      <div class=\"container\">\n        <h2 class=\"numbered-heading\" data-number=\"02\">Technical Build Proof</h2>\n        <p style=\"max-width: 800px; margin-bottom: var(--space-8)\">\n          Production systems that demonstrate the technical depth behind the commercial work.\n        </p>\n\n        <div class=\"projects-grid\">\n{cards}\n        </div>\n      </div>\n    </section>"""


def render_case_study_card(case_study: dict) -> str:
    highlights = "\n".join(
        f"                <li>{escape(highlight)}</li>" for highlight in case_study["highlights"]
    )
    return f"""          <article class=\"project-card reveal\" data-category=\"{escape(case_study['category'])}\" id=\"{escape(case_study['id'])}\">\n            <div class=\"project-content\">\n              <p class=\"project-type\">{escape(case_study['displayCategory'])}</p>\n              <h3 class=\"project-title\">{escape(case_study['title'])}</h3>\n              <p class=\"project-desc\">{escape(case_study['description'])}</p>\n              <ul class=\"list-check\" style=\"margin-bottom: 0\">\n{highlights}\n              </ul>\n            </div>\n          </article>"""


def render_sanitized_case_studies(case_studies: list[dict]) -> str:
    cards = "\n\n".join(render_case_study_card(case_study) for case_study in case_studies)
    return f"""    <section\n      class=\"section\"\n      style=\"background-color: var(--color-bg-secondary)\"\n    >\n      <div class=\"container\">\n        <h2 class=\"numbered-heading\" data-number=\"01\">\n          Commercial Decision Problems Solved\n        </h2>\n        <p style=\"max-width: 800px; margin-bottom: var(--space-8)\">\n          Public-safe summaries of forecasting, pricing, margin, CRM, governance, and workflow problems repaired in live operating environments.\n        </p>\n\n        <div class=\"projects-grid\">\n{cards}\n        </div>\n      </div>\n    </section>"""


def generate_portfolio_page(data: dict) -> None:
    category_names = category_name_map(data)
    featured_project = next(project for project in data["projects"] if project["id"] == "algo-trading-ai")
    build_projects = [project for project in data["projects"] if project["id"] != featured_project["id"]]

    content = read_text("portfolio.html")
    content = replace_once(
        content,
        r"    <!-- Schema\.org markup -->\s*<script type=\"application/ld\+json\">.*?</script>",
        render_item_list_schema(data),
    )
    portfolio_sections = "\n\n".join(
        [
            "    <!-- Filter Tabs -->\n" + render_filter_tabs(data),
            "    <!-- Sanitized Case Studies -->\n" + render_sanitized_case_studies(data["caseStudies"]),
            "    <!-- Featured Project -->\n"
            + render_featured_project(featured_project, category_names[featured_project["category"]]),
            "    <!-- Projects Grid -->\n"
            + render_build_proof_section(build_projects, category_names),
        ]
    )
    content = replace_once(
        content,
        r"    <!-- Filter Tabs -->.*?    <!-- CTA -->",
        portfolio_sections + "\n\n    <!-- CTA -->",
    )

    write_text("portfolio.html", content)


def render_case_study_head(project: dict) -> str:
    detail = project["detailPage"]
    title = f"{project['title']} | Jason Rae Case Study"
    meta_description = detail["metaDescription"]
    keywords = detail["metaKeywords"]
    url = join_url(project["caseStudyUrl"])
    schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": project["title"],
        "applicationCategory": detail["applicationCategory"],
        "operatingSystem": detail["operatingSystem"],
        "description": detail["schemaDescription"],
        "creator": {"@type": "Person", "name": "Jason Rae"},
        "url": url,
        "keywords": keywords,
        "featureList": project["highlights"][:4],
    }
    schema_json = json.dumps(schema, ensure_ascii=False, indent=2)
    return f"""  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta\n      name=\"description\"\n      content=\"{escape(meta_description)}\"\n    />\n    <meta\n      name=\"keywords\"\n      content=\"{escape(keywords)}\"\n    />\n    <meta name=\"author\" content=\"Jason Rae\" />\n    <link\n      rel=\"canonical\"\n      href=\"{escape(url)}\"\n    />\n\n    <meta\n      property=\"og:title\"\n      content=\"{escape(title)}\"\n    />\n    <meta\n      property=\"og:description\"\n      content=\"{escape(meta_description)}\"\n    />\n    <meta property=\"og:type\" content=\"article\" />\n    <meta\n      property=\"og:url\"\n      content=\"{escape(url)}\"\n    />\n    <meta property=\"og:site_name\" content=\"Jason Rae\" />\n    <meta\n      property=\"og:image\"\n      content=\"{BASE_URL}/assets/images/og-image.png\"\n    />\n    <meta\n      property=\"og:image:alt\"\n      content=\"{escape(SOCIAL_ALT)}\"\n    />\n\n    <meta name=\"twitter:card\" content=\"summary_large_image\" />\n    <meta\n      name=\"twitter:title\"\n      content=\"{escape(title)}\"\n    />\n    <meta\n      name=\"twitter:description\"\n      content=\"{escape(meta_description)}\"\n    />\n    <meta\n      name=\"twitter:image\"\n      content=\"{BASE_URL}/assets/images/og-image.png\"\n    />\n    <meta\n      name=\"twitter:image:alt\"\n      content=\"{escape(SOCIAL_ALT)}\"\n    />\n\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"../assets/images/favicon.svg\" />\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link rel=\"dns-prefetch\" href=\"https://cdnjs.cloudflare.com\" />\n\n    <link\n      rel=\"stylesheet\"\n      href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\n    />\n\n    <link rel=\"stylesheet\" href=\"../css/style.css\" />\n\n    <link\n      rel=\"stylesheet\"\n      href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/fontawesome.min.css\"\n    />\n    <link\n      rel=\"stylesheet\"\n      href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/solid.min.css\"\n    />\n    <link\n      rel=\"stylesheet\"\n      href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/brands.min.css\"\n    />\n\n    <title>{escape(title)}</title>\n\n    <script type=\"application/ld+json\">\n{chr(10).join(f'      {line}' for line in schema_json.splitlines())}\n    </script>\n  </head>"""


def render_case_study_hero(project: dict, category_label: str) -> str:
    detail = project["detailPage"]
    tech_badges = "\n".join(
        f"            <span class=\"badge badge-primary\">{escape(badge)}</span>"
        for badge in detail["heroTechBadges"]
    )
    return f"""    <section class=\"section case-study-hero\">\n      <div class=\"container\">\n        <div class=\"card case-study-hero-card reveal\">\n          <p class=\"section-label\">Case Study</p>\n          <div class=\"case-study-meta\">\n            <span class=\"badge badge-success\">{escape(project['status'])}</span>\n            <span class=\"badge badge-warning\">{escape(project['year'])}</span>\n            <span class=\"badge badge-primary\">{escape(category_label)}</span>\n          </div>\n          <h1 style=\"margin-bottom: var(--space-4)\">\n            {escape(project['title'])}\n          </h1>\n          <p\n            class=\"section-subtitle\"\n            style=\"max-width: 900px; margin-bottom: 0\"\n          >\n            {escape(detail['heroSummary'])}\n          </p>\n          <div class=\"case-study-stack\" aria-label=\"Technology badges\">\n{tech_badges}\n          </div>\n        </div>\n      </div>\n    </section>"""


def render_case_study_sidebar(project: dict) -> str:
    detail = project["detailPage"]
    metrics = "\n".join(
        f"              <div class=\"metric-item\">\n                <span class=\"metric-label\">{escape(prettify_metric_label(label))}</span>\n                <p class=\"metric-value\">\n                  {escape(value)}\n                </p>\n              </div>"
        for label, value in project["metrics"].items()
    )
    highlights = "\n".join(
        f"              <li>{escape(highlight)}</li>" for highlight in project["highlights"]
    )
    technologies = "\n".join(
        f"              <span class=\"tag\">{escape(technology)}</span>" for technology in project["technologies"]
    )
    return f"""        <aside class=\"case-study-sidebar\">\n          <div class=\"card reveal\">\n            <h2 class=\"card-title\">Results &amp; Metrics</h2>\n            <div class=\"metric-list\">\n{metrics}\n            </div>\n          </div>\n\n          <div class=\"card reveal\">\n            <h2 class=\"card-title\">Project Highlights</h2>\n            <ul class=\"list-check\" style=\"margin-bottom: 0\">\n{highlights}\n            </ul>\n          </div>\n\n          <div class=\"card reveal\">\n            <h2 class=\"card-title\">Technologies</h2>\n            <div class=\"tags\">\n{technologies}\n            </div>\n          </div>\n\n          <div class=\"card reveal\">\n            <h2 class=\"card-title\">Call To Action</h2>\n            <p>\n              If you need production-grade decision systems rather than another isolated pilot, start with a Diagnostic Review.\n            </p>\n            <div class=\"case-study-actions\">\n              <a href=\"../contact.html\" class=\"btn btn-primary\">{escape(detail['ctaLabel'])}</a>\n            </div>\n          </div>\n        </aside>"""


def generate_case_study_pages(data: dict) -> None:
    category_names = category_name_map(data)
    for project in data["projects"]:
        if not project.get("caseStudyUrl"):
            continue

        relative_path = project["caseStudyUrl"]
        content = read_text(relative_path)
        content = replace_once(content, r"  <head>.*?</head>", render_case_study_head(project))
        content = replace_once(
            content,
            r"    <section class=\"section case-study-hero\">.*?</section>\s*\n\s*    <section class=\"section-sm\" style=\"padding-top: 0\">",
            render_case_study_hero(project, category_names[project["category"]])
            + "\n\n    <section class=\"section-sm\" style=\"padding-top: 0\">",
        )
        content = replace_once(
            content,
            r"        <aside class=\"case-study-sidebar\">.*?</aside>",
            render_case_study_sidebar(project),
        )
        write_text(relative_path, content)


def main() -> None:
    data = load_data()
    validate_data(data)
    generate_portfolio_page(data)
    generate_case_study_pages(data)
    print("Portfolio pages generated from assets/data/projects.json")


if __name__ == "__main__":
    main()
