#!/usr/bin/env python3
import argparse
from textwrap import dedent


def build_plan(hours: int, goal: str) -> str:
    backend_focus = [
        "2h: fundamentos (HTTP, REST, status codes)",
        "3h: prática com API + validações",
        "2h: testes automatizados",
        "2h: deploy e observabilidade",
        "1h: revisão técnica e retrospectiva",
    ]

    frontend_focus = [
        "2h: HTML semântico + acessibilidade",
        "3h: JavaScript moderno",
        "2h: estado e consumo de APIs",
        "2h: testes e performance",
        "1h: revisão e refatoração",
    ]

    trilha = backend_focus if "back" in goal.lower() else frontend_focus
    ratio = max(hours, 1) / 10

    rows = [f"Plano semanal para objetivo: {goal} ({hours}h/semana)"]
    for item in trilha:
        block, detail = item.split(":", 1)
        block_hours = float(block.replace("h", "")) * ratio
        rows.append(f"- {block_hours:.1f}h:{detail.strip()}")
    return "\n".join(rows)


def build_standup(yesterday: str, today: str, blockers: str) -> str:
    return dedent(
        f"""
        Standup Diário
        - Ontem: {yesterday}
        - Hoje: {today}
        - Impedimentos: {blockers}
        """
    ).strip()


def main() -> None:
    parser = argparse.ArgumentParser(description="DevTool CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    plan_parser = subparsers.add_parser("plan", help="Gerar plano semanal")
    plan_parser.add_argument("--hours", type=int, required=True)
    plan_parser.add_argument("--goal", type=str, required=True)

    standup_parser = subparsers.add_parser("standup", help="Gerar texto de standup")
    standup_parser.add_argument("--yesterday", type=str, required=True)
    standup_parser.add_argument("--today", type=str, required=True)
    standup_parser.add_argument("--blockers", type=str, default="Nenhum")

    args = parser.parse_args()

    if args.command == "plan":
        print(build_plan(args.hours, args.goal))
    elif args.command == "standup":
        print(build_standup(args.yesterday, args.today, args.blockers))


if __name__ == "__main__":
    main()
