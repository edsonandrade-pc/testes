import unittest
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "dev_tool", Path("apps/devtool-cli/dev_tool.py")
)
dev_tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dev_tool)


class DevToolTests(unittest.TestCase):
    def test_plan_contains_goal_and_hours(self):
        result = dev_tool.build_plan(10, "Backend")
        self.assertIn("Backend", result)
        self.assertIn("10h/semana", result)

    def test_standup_format(self):
        result = dev_tool.build_standup("Bugfix", "Refactor", "Sem bloqueios")
        self.assertIn("Ontem: Bugfix", result)
        self.assertIn("Hoje: Refactor", result)


if __name__ == "__main__":
    unittest.main()
